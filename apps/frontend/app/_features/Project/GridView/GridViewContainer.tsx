'use client'

import { useTaskStore } from '@/store/task'
import CustomFieldMultiAction from '@/features/CustomFieldMultiAction'
import GridRowContainer from './GridRowContainer'
import useTaskFilterContext from '@/features/TaskFilter/useTaskFilterContext'

export default function GridViewContainer() {
  const { tasks } = useTaskStore()
  const { groupByItems } = useTaskFilterContext()

  return (
    <div className="pb-[300px]">
      <div className="divide-y dark:divide-gray-800">
        <GridRowContainer tasks={tasks} />
      </div>
      <CustomFieldMultiAction />
    </div>
  )
}

