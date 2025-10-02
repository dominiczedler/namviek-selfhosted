import { ExtendedTask } from '@/store/task'
import { useParams, useRouter } from 'next/navigation'

import { useUrl } from '@/hooks/useUrl'
import PriorityText from '@/components/PriorityText'
import { Loading, Popover, Tooltip, messageWarning } from '@ui-components'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import differenceInDays from 'date-fns/differenceInDays'
import { format, isToday, isTomorrow, isWithinInterval, subDays } from 'date-fns'
import { useStatusUtils } from '@/hooks/useStatusUtils'
import { StatusType } from '@prisma/client'

import TaskTypeIcon from '@/components/TaskTypeSelect/Icon'
import TaskDate from '../views/TaskDate'
import TaskAssignee from '../views/TaskAssignee'
import { useTaskUpdate } from '../views/useTaskUpdate'
import { useState } from 'react'
import TaskCheckbox from '@/components/TaskCheckbox'
import { GoTasklist } from 'react-icons/go'
import { HiListBullet } from 'react-icons/hi2'
import TaskChecklist from '@/features/TaskChecklist'
import { useMemo } from 'react'
import { pushState } from 'apps/frontend/libs/pushState'
import TimerButton from '@/features/TimeTracker/TimerButton'

function BoardItemCover({ cover }: { cover: string | null }) {
  if (!cover) return null

  return (
    <div className="max-h-60 -mx-3 bg-gray-50 dark:bg-gray-800 -mt-3 mb-2 rounded-t-md overflow-hidden">
      <img alt="task cover" src={cover} />
    </div>
  )
}

export default function BoardItem({ data }: { data: ExtendedTask }) {
  const { getStatusTypeByTaskId } = useStatusUtils()
  const { updateTaskData } = useTaskUpdate()
  const [dateValue, setDateValue] = useState(data.dueDate ? new Date(data.dueDate) : null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const progress = useMemo(() => {
    const done = data.checklistDone || 0
    const todo = data.checklistTodos || 0
    const percent = (done / (todo + done)) * 100
    return isNaN(percent) ? 0 : Math.round(percent)
  }, [JSON.stringify(data)])

  const includeRandID = data.id.includes('TASK-ID-RAND')
  const dateClasses: string[] = []
  const taskStatusType = getStatusTypeByTaskId(data.id)
  const { dueDate } = data
  const onClick = () => {
    if (includeRandID) {
      messageWarning('This task has been creating by server !')
      return
    }
    pushState('taskId', data.id)
    // replace(link)
  }

  const isOverdue =
    dueDate &&
    taskStatusType !== StatusType.DONE &&
    differenceInDays(new Date(dueDate), new Date()) < 0

  const getDateDisplay = (date: Date | null) => {
    if (!date) return null

    const dateObj = new Date(date)
    const now = new Date()
    const daysDiff = differenceInDays(dateObj, now)

    // Today
    if (isToday(dateObj)) {
      return { text: 'Today', color: 'text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' }
    }

    // Tomorrow
    if (isTomorrow(dateObj)) {
      return { text: 'Tomorrow', color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' }
    }

    // Overdue
    if (daysDiff < 0) {
      const daysAgo = Math.abs(daysDiff)
      if (daysAgo < 7) {
        return { text: `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' }
      }
      return { text: format(dateObj, 'MMM d'), color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' }
    }

    // Future within 7 days - show weekday
    if (daysDiff < 7) {
      return { text: format(dateObj, 'EEEE'), color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' }
    }

    // Future beyond 7 days - show date
    return { text: format(dateObj, 'MMM d'), color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' }
  }

  const dateDisplay = dueDate ? getDateDisplay(new Date(dueDate)) : null

  const onDateUpdate = (date: Date | undefined) => {
    if (!date) return
    setDateValue(date)
    setDatePickerOpen(false)
    updateTaskData({
      id: data.id,
      dueDate: date
    })
  }

  return (
    <div className="board-item relative">
      <BoardItemCover cover={data.cover} />
      <PriorityText type={data.priority || 'LOW'} />
      <Loading.Absolute enabled={includeRandID} />

      <h2
        onClick={onClick}
        className="text-sm dark:text-gray-400 text-gray-600 whitespace-normal hover:underline cursor-pointer space-x-1 active:scale-[97%] transition-all">
        <span>{data.title}</span>
        <TaskTypeIcon size="sm" type={data.type || ''} />
      </h2>
      {dateDisplay && (
        <PopoverPrimitive.Root open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverPrimitive.Trigger asChild>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-colors hover:bg-opacity-80 cursor-pointer ${dateDisplay.color}`}>
              <img
                src="/icons/calendar-day.svg"
                alt="Calendar"
                className="w-3 h-3 opacity-60"
              />
              <span>{dateDisplay.text}</span>
            </div>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content sideOffset={4} className="popover-content">
              <DayPicker
                mode="single"
                selected={dateValue || undefined}
                onSelect={onDateUpdate}
                showOutsideDays
                fixedWeeks
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={2100}
                numberOfMonths={1}
                defaultMonth={dateValue || new Date()}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      )}

      <div className="board-item-action">
        <div className="flex items-center gap-2">
          <TimerButton
            taskId={data.id}
            taskName={data.title}
            disabled={includeRandID}
          />

          <TaskAssignee
            className="no-name"
            taskId={data.id}
            uids={data.assigneeIds}
          />
        </div>
        <TaskCheckbox id={data.id} selected={data.selected} />
      </div>

      {(data.checklistDone || data.checklistTodos) ? (
        <Popover
          triggerBy={
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 mt-2">
              <HiListBullet className="w-3.5 h-3.5" />
              <span>{(data.checklistDone || 0) + (data.checklistTodos || 0)} subtasks</span>
            </div>
          }
          content={
            <div className="px-4 pt-4 pb-1 border bg-white dark:bg-gray-900 dark:border-gray-700 rounded-md w-[300px]">
              <TaskChecklist taskId={data.id} />
            </div>
          }
        />
      ) : null}

      {progress ? (
        <div className="absolute bottom-0 left-0 w-full rounded-b-md overflow-hidden">
          <div
            className={`h-1 ${
              isOverdue && progress < 100 ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{ width: `${progress}%` }}></div>
        </div>
      ) : null}
    </div>
  )
}
