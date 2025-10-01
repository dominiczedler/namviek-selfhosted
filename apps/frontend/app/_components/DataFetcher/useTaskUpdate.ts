import { useTaskStore } from "@/store/task"
import { messageSuccess } from "@ui-components"
import { projectGridSv } from "@/services/project.grid"
import { FieldType, Prisma } from "@prisma/client"
import { useUser } from "@auth-client"

export const useTaskUpdate = () => {
  const { tasks, updateTask } = useTaskStore()
  const { user } = useUser()

  const updateOneField = ({ taskId, value, fieldId, type }: {
    taskId: string,
    value: string | string[],
    fieldId: string,
    type: FieldType
  }) => {
    // Find task and update its custom fields
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const updatedCustomFields = { ...(task.customFields as Prisma.JsonObject || {}) }
      updatedCustomFields[fieldId] = value

      updateTask({
        id: taskId,
        customFields: updatedCustomFields,
        updatedAt: new Date(),
        updatedBy: user?.id || ''
      })
    }

    // Update on server
    projectGridSv.update({
      taskId,
      type,
      value,
      fieldId
    }).then(res => {
      const { data, status } = res.data
      console.log('returned data:', data, status)
      if (status !== 200) return
      messageSuccess('Update field value success')
    })
  }

  return {
    updateOneField
  }
}
