import React from "react"
import { JobProgress } from "./JobProgress"
import { Button } from "@/components/ui/button"

export function JobProgressList({ jobs, currentIdx, onRetry, isRetrying }) {
  return (
    <div className="w-full">
      {jobs.map((job, idx) => (
        <div key={`${job.jobInfo?.jobId || "job"}-${idx}`}>
          <JobProgress
            jobInfo={job.jobInfo}
            streamMsgs={job.streamMsgs}
            isCurrent={idx === currentIdx}
            isNext={idx === currentIdx + 1}
            isDone={idx < currentIdx}
            hasError={job.streamMsgs?.some((msg) => msg.error)}
          />
          {job.streamMsgs?.some((msg) => msg.error) && onRetry && (
            <div className="flex justify-end mt-2">
              <Button
                onClick={() => onRetry(job, idx)}
                disabled={isRetrying}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded"
              >
                {isRetrying ? "Retrying..." : "Retry"}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
