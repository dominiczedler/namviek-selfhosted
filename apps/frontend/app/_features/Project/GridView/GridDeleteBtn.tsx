import { useTaskStore } from "@/store/task";
import { projectGridSv } from "@/services/project.grid";
import { Button, confirmAlert, messageSuccess } from "@ui-components";
import { HiOutlineTrash } from "react-icons/hi2";

export default function GridDeleteBtn({ rowId }: { rowId: string }) {
  const { delTask } = useTaskStore()

  const onDelete = () => {
    confirmAlert({
      message: 'Are you sure you want to delete this task ?',
      yes: () => {
        delTask(rowId)
        projectGridSv.delete([rowId]).then(res => {
          console.log(res)
          messageSuccess('Deleted successfully')
        })
      }
    })
  }

  return <Button size="sm" leadingIcon={<HiOutlineTrash />} onClick={onDelete} />
}
