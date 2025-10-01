import TaskCheckbox from '@/components/TaskCheckbox'
import { ExtendedTask } from '@/store/task'
import TaskStatus from './TaskStatus'
import TaskActions from '@/features/TaskActions'
import ListCell from './ListCell'
import TaskAssignee from './TaskAssignee'
import TaskPriorityCell from './TaskPriorityCell'
import TaskPoint from './TaskPoint'
import TaskDate from './TaskDate'
import ProgressBar from '@/components/ProgressBar'
import { useParams, useRouter } from 'next/navigation'
import { useUrl } from '@/hooks/useUrl'
import { Loading, messageWarning } from '@ui-components'

import TaskTypeCell from './TaskTypeCell'
import TaskChecklist from '@/features/TaskChecklist'
import TaskProgress from './TaskProgress'
import { useMemo } from 'react'
import TaskTitle from './TaskTitle'
import CustomFieldDisplay from '@/features/CustomFieldDisplay'
import CustomFieldInputFactory from '@/features/CustomFieldInput/CustomFieldInputFactory'
import CustomFieldInputProvider from '@/features/CustomFieldInput/CustomFieldInputProvider'
import { FieldType, Prisma } from '@prisma/client'
import { useTaskUpdate } from '@/components/DataFetcher/useTaskUpdate'

export default function ListRow({ task }: { task: ExtendedTask }) {
  const isRandomId = task.id.includes('TASK-ID-RAND')
  const { updateOneField } = useTaskUpdate()
  const taskCustomData = task.customFields
  const customData = (taskCustomData || {}) as Prisma.JsonObject

  const progress = useMemo(() => {
    const done = task.checklistDone || 0
    const todo = task.checklistTodos || 0
    const percent = (done / (todo + done)) * 100
    return isNaN(percent) ? 0 : Math.round(percent)
  }, [JSON.stringify(task)])

  const getFixedValue = (type: FieldType, defaultData: string) => {
    switch (type) {
      case FieldType.CREATED_BY:
        return task.createdBy || ''
      case FieldType.CREATED_AT:
        return task.createdAt ? task.createdAt.toString() : ''
      case FieldType.UPDATED_AT:
        return task.updatedAt ? task.updatedAt.toString() : ''
      case FieldType.UPDATED_BY:
        return task.updatedBy || ''
      default:
        return defaultData
    }
  }

  return (
    <div
      className="px-3 py-2 text-sm group relative transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
      key={task.id}>
      <div className="flex items-center">
        {/* Left side - Title section */}
        <div className="flex items-center gap-2 dark:text-gray-300 flex-1">
          <TaskCheckbox id={task.id} selected={task.selected} />
          <TaskStatus taskId={task.id} value={task.taskStatusId || ''} />
          {isRandomId ? <Loading enabled={true} spinnerSpeed="fast" /> : null}
          <TaskTitle id={task.id} projectId={task.projectId} title={task.title} />
          <TaskActions
            className="opacity-0 group-hover:opacity-100 transition-all duration-100"
            taskId={task.id}
          />
        </div>

        {/* Right side - Data columns aligned with header */}
        <div className="hidden sm:flex items-center text-xs font-medium text-gray-500 dark:text-gray-300">
          <ListCell width={150}>
            <TaskAssignee
              className="no-name"
              taskId={task.id}
              uids={task.assigneeIds}
            />
          </ListCell>
          <ListCell width={115}>
            <TaskTypeCell type={task.type} taskId={task.id} />
          </ListCell>
          <ListCell width={75}>
            <TaskPriorityCell taskId={task.id} value={task.priority} />
          </ListCell>
          <ListCell width={50}>
            <TaskPoint taskId={task.id} value={task.taskPoint} />
          </ListCell>
          <ListCell width={110}>
            <TaskDate
              toNow={true}
              taskId={task.id}
              date={task.dueDate ? new Date(task.dueDate) : null}
            />
          </ListCell>
          <ListCell width={70}>
            <TaskProgress progress={progress} taskId={task.id} />
          </ListCell>
          {/* Custom Field Columns */}
          <CustomFieldDisplay>
            {(index, fieldData) => {
              const { id, type, width } = fieldData
              const data = JSON.stringify(fieldData.data)
              const config = JSON.stringify(fieldData.config)
              const dataValue = customData[id]
              const dataStrValue = getFixedValue(type, dataValue ? (dataValue + '') : '')

              return (
                <ListCell width={width || 120}>
                  <CustomFieldInputProvider onChange={(value) => {
                    updateOneField({
                      taskId: task.id,
                      value,
                      fieldId: id,
                      type
                    })
                  }}>
                    <CustomFieldInputFactory
                      rowId={task.id}
                      data={data}
                      config={config}
                      type={type}
                      value={dataStrValue} />
                  </CustomFieldInputProvider>
                </ListCell>
              )
            }}
          </CustomFieldDisplay>
          {/* Empty cell for Create Field button column */}
          <ListCell width={120}>
            <span></span>
          </ListCell>
        </div>
      </div>
    </div>
  )
}
