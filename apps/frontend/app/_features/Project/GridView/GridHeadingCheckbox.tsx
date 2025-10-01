import { useTaskStore } from "@/store/task";
import CustomFieldCheckboxAll from "@/features/CustomFieldCheckbox/CustomFieldCheckboxAll";

export default function GridHeadingCheckbox() {

  const taskIds = useTaskStore(state => state.tasks.map(d => d.id))

  return <CustomFieldCheckboxAll taskIds={taskIds} />
}
