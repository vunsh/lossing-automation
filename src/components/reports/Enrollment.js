export default function Enrollment() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Enrollment Report</h2>
      <iframe
        src="https://radius.mathnasium.com/Enrollment/EnrollmentReport"
        className="w-full h-[70vh] rounded-lg border"
        title="Enrollment Report"
      />
    </div>
  )
}
