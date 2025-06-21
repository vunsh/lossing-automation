import { CheckCircle2 } from "lucide-react"

export default function Success({ jobs }) {
  return (
    <div className="flex flex-col items-center justify-center pb-12 pt-4">
      <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-lg animate-bounce" />
      <div className="text-3xl font-extrabold text-green-500 mb-2 drop-shadow-lg tracking-tight text-center">
        All Reports Complete!
      </div>
      <div className="text-lg text-neutral-200 mb-4 text-center">
        🎉 All selected reports have been successfully generated. 🎉
      </div>
      <div className="w-full max-w-xl rounded-xl border border-green-700 p-6 mt-2 shadow-lg bg-gradient-to-br from-green-900/70 via-neutral-900/80 to-green-800/60">
        <div className="font-semibold text-green-400 mb-4 text-lg flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-green-400 animate-pulse" />
          Completed Jobs
        </div>
        <hr className="border-green-700 mb-4 opacity-40" />
        <ul className="space-y-3">
          {jobs.map((job, idx) => (
            <li
              key={job.jobInfo?.jobId || idx}
              className="flex items-center gap-4 bg-green-950/40 rounded-lg px-4 py-2 shadow-sm hover:bg-green-900/60 transition"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white font-bold text-sm shadow">
                {idx + 1}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-xs text-green-300">{job.jobInfo.jobId}</span>
                <span className="font-semibold text-green-400 text-base">
                  {job.jobInfo.report?.toUpperCase()}
                  <span className="ml-2 text-neutral-300 text-sm">({job.jobInfo.region})</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 text-green-300 text-sm italic text-center">
        All reports have been uploaded to their individual regional sheets.
      </div>
    </div>
  )
}
