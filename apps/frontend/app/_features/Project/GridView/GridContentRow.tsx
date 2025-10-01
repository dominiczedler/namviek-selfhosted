import { memo, useMemo } from "react";
import CustomFieldCheckboxItem from "@/features/CustomFieldCheckbox/CustomFieldCheckboxItem"
import CustomFieldDisplay from "@/features/CustomFieldDisplay"
import CustomFieldInputFactory from "@/features/CustomFieldInput/CustomFieldInputFactory"
import CustomFieldInputProvider from "@/features/CustomFieldInput/CustomFieldInputProvider"
import { ExtendedTask } from "@/store/task"
import { FieldType, Prisma } from "@prisma/client"
import { useTaskUpdate } from "@/components/DataFetcher/useTaskUpdate";
import GridBtnActions from "./GridBtnActions";
import TaskTitle from "../../../[orgName]/project/[projectId]/views/TaskTitle";
import TaskStatus from "../../../[orgName]/project/[projectId]/views/TaskStatus";
import TaskAssignee from "../../../[orgName]/project/[projectId]/views/TaskAssignee";
import TaskTypeCell from "../../../[orgName]/project/[projectId]/views/TaskTypeCell";
import TaskPriorityCell from "../../../[orgName]/project/[projectId]/views/TaskPriorityCell";
import TaskDate from "../../../[orgName]/project/[projectId]/views/TaskDate";
import TaskProgress from "../../../[orgName]/project/[projectId]/views/TaskProgress";

const useOnChangeCustomFieldInput = (taskId: string) => {

  const { updateOneField } = useTaskUpdate()
  const onChange = (value: string | string[], fieldId: string, type: FieldType) => {
    updateOneField({
      taskId,
      type,
      value,
      fieldId
    })
  }

  return {
    onChange
  }
}

function GridContentRow({ task }: { task: ExtendedTask }) {

  const taskCustomData = task.customFields
  const customData = (taskCustomData || {}) as Prisma.JsonObject
  const { onChange } = useOnChangeCustomFieldInput(task.id)

  const progress = useMemo(() => {
    const done = task.checklistDone || 0
    const todo = task.checklistTodos || 0
    const percent = (done / (todo + done)) * 100
    return isNaN(percent) ? 0 : Math.round(percent)
  }, [task.checklistDone, task.checklistTodos])

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

  return <div data-testid={task.id} className="list-row"
    key={task.id}>

    <CustomFieldCheckboxItem taskId={task.id} />

    {/* Default columns */}
    <div className="list-cell px-2 py-1" style={{ width: 300 }}>
      <TaskTitle id={task.id} projectId={task.projectId} title={task.title} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 120 }}>
      <TaskStatus taskId={task.id} value={task.taskStatusId || ''} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 150 }}>
      <TaskAssignee className="no-name" taskId={task.id} uids={task.assigneeIds} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 100 }}>
      <TaskTypeCell type={task.type} taskId={task.id} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 100 }}>
      <TaskPriorityCell taskId={task.id} value={task.priority} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 120 }}>
      <TaskDate toNow={true} taskId={task.id} date={task.dueDate ? new Date(task.dueDate) : null} />
    </div>
    <div className="list-cell px-2 py-1 flex items-center justify-center" style={{ width: 80 }}>
      <TaskProgress progress={progress} taskId={task.id} />
    </div>

    {/* Custom field columns */}
    <CustomFieldDisplay>
      {(index, fieldData) => {
        const { id, type } = fieldData
        const data = JSON.stringify(fieldData.data)
        const config = JSON.stringify(fieldData.config)
        const dataValue = customData[id]
        const dataStrValue = getFixedValue(type, dataValue ? (dataValue + '') : '')

        return <>
          <CustomFieldInputProvider onChange={(value) => {
            onChange(value, id, type)
          }} >
            <CustomFieldInputFactory
              rowId={task.id}
              data={data}
              config={config}
              type={type}
              value={dataStrValue} />

            <GridBtnActions display={index === 0} rowId={task.id} />
          </CustomFieldInputProvider>
        </>
      }}
    </CustomFieldDisplay>

  </div>
}
export default memo(GridContentRow)
