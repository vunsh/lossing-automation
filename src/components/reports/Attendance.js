export default function Attendance() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Attendance Report</h2>
      <iframe
        src="https://radius.mathnasium.com/StudentAttendanceMonthlyReport"
        className="w-full h-[70vh] rounded-lg border"
        title="Attendance Report"
      />
    </div>
  )
}
