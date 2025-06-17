export default function Timesheet() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Instructor Timesheet</h2>
      <iframe
        src="https://radius.mathnasium.com/EmployeeAttendance/InstructorTimeSheet"
        className="w-full h-[70vh] rounded-lg border"
        title="Instructor Timesheet"
      />
    </div>
  )
}
