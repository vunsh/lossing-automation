import { CheckCircle2 } from "lucide-react"

export default function Success({ jobs }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-lg" />
      <div className="text-3xl font-bold text-green-500 mb-2">All Reports Complete!</div>
      <div className="text-lg text-neutral-200 mb-4">
        All selected reports have been successfully generated.
      </div>
      <div className="w-full max-w-xl bg-neutral-900/80 rounded-xl border border-green-700 p-6 mt-2">
        <div className="font-semibold text-green-400 mb-2">Completed Jobs:</div>
        <ul className="list-disc pl-6 text-neutral-100">
          {jobs.map((job, idx) => (
            <li key={job.jobInfo?.jobId || idx}>
              <span className="font-mono text-xs text-neutral-400">{job.jobInfo.jobId}</span>
              <span className="ml-2 font-semibold text-green-400">{job.jobInfo.report?.toUpperCase()}</span>
              <span className="ml-2 text-neutral-300">({job.jobInfo.region})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
