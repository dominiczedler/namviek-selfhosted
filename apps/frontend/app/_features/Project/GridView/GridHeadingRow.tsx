import CustomFieldDisplay from "@/features/CustomFieldDisplay";
import CustomFieldAction from "@/features/CustomFieldDisplay/CustomFieldAction";
import CustomFieldResize from "@/features/CustomFieldDisplay/CustomFieldResize";
import GridHeadingCheckbox from "./GridHeadingCheckbox";

export default function GridHeadingRow() {

  return <div className="list-heading list-row">
    <GridHeadingCheckbox />

    {/* Default columns */}
    <div className="list-cell" style={{ width: 300 }}>
      <div className="text-sm font-medium">Title</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 120 }}>
      <div className="text-sm font-medium">Status</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 150 }}>
      <div className="text-sm font-medium">Assignees</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 100 }}>
      <div className="text-sm font-medium">Type</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 100 }}>
      <div className="text-sm font-medium">Priority</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 120 }}>
      <div className="text-sm font-medium">Due Date</div>
    </div>
    <div className="list-cell flex items-center justify-center" style={{ width: 80 }}>
      <div className="text-sm font-medium">Progress</div>
    </div>

    {/* Custom field columns */}
    <CustomFieldDisplay sortable={true} createBtn={true}>
      {(index, fieldData) => {
        const { name, width, id } = fieldData
        return <>
          <div className="flex items-center justify-between gap-2 text-sm">
            {name}
            <CustomFieldAction data={fieldData} />
          </div>
          <CustomFieldResize id={id} index={index} width={width || 100} />
        </>
      }}
    </CustomFieldDisplay>
  </div>
}
