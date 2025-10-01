import { useTaskStore } from "@/store/task"
import { randomId } from "@ui-components"
import { useParams } from "next/navigation"
import { ExtendedTask } from "@/store/task"
import { projectGridSv } from "@/services/project.grid"

export const useTaskAdd = () => {
  const { addOneTask, updateTask } = useTaskStore()
  const { projectId } = useParams()

  const addNewRow = (data?: Partial<ExtendedTask>) => {
    const id = `TASK_RAND_${randomId()}`
    const insertedData = {
      id,
      title: '',
      projectId: projectId as string,
      customFields: {},
      selected: false
    } as ExtendedTask

    // Add to local store immediately
    addOneTask(insertedData)

    // Create on server
    projectGridSv.create(insertedData).then(res => {
      console.log(res)
      const { data, status } = res.data
      if (status !== 200) return

      // Update local store with server response
      updateTask(data)
    })
  }

  return {
    addNewRow
  }
}
