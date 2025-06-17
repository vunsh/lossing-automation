export default function LeadTracking() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Lead Tracking Report</h2>
      <iframe
        src="https://radius.mathnasium.com/LeadsTrackingReport"
        className="w-full h-[70vh] rounded-lg border"
        title="Lead Tracking Report"
      />
    </div>
  )
}
