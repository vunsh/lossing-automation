import React, { useState } from "react"
import { JobProgress } from "./JobProgress"
import { Button } from "@/components/ui/button"

function NextUpIndicator({ jobs, currentIdx }) {
  const nextIdx = currentIdx + 1
  if (jobs.length === 0) return null
  if (nextIdx >= jobs.length) {
    return (
      <div className="flex items-center gap-2 mb-4 mt-2 text-yellow-400 text-sm font-semibold justify-center">
        <span>Last Report currently running!</span>
      </div>
    )
  }
  const nextJob = jobs[nextIdx]
  return (
    <div className="flex items-center gap-2 mb-4 mt-2 text-yellow-400 text-sm font-semibold justify-center">
      <span>Next Up:</span>
      <span className="font-mono bg-yellow-900/30 rounded px-2 py-0.5">{nextJob.jobInfo.report?.toUpperCase()}</span>
      <span className="text-yellow-300">({nextJob.jobInfo.region})</span>
    </div>
  )
}

export function JobProgressList({ jobs, currentIdx, onRetry, isRetrying }) {
  const [collapsed, setCollapsed] = useState(() => jobs.map((_, idx) => idx <= currentIdx || idx === currentIdx + 1))

  React.useEffect(() => {
    setCollapsed(jobs.map((_, idx) => idx <= currentIdx || idx === currentIdx + 1))
  }, [jobs.length, currentIdx])

  const reversedJobs = [...jobs].reverse()

  return (
    <div className="w-full">
      <NextUpIndicator jobs={jobs} currentIdx={currentIdx} />
      {reversedJobs.map((job, idx) => {
        const realIdx = jobs.length - 1 - idx
        const isCurrent = realIdx === currentIdx
        const isDone = realIdx < currentIdx
        const isNextUp = realIdx === currentIdx + 1
        if (!(isDone || isCurrent || isNextUp)) {
          return null;
        }
        const isError = job.streamMsgs?.some((msg) => msg.error)
        if (isDone || isNextUp) {
          const shouldCollapse = isNextUp && !isCurrent ? true : collapsed[realIdx];
          return (
            <div key={`${job.jobInfo?.jobId || "job"}-${realIdx}`} className="mb-2">
              <JobProgress
                jobInfo={job.jobInfo}
                streamMsgs={job.streamMsgs}
                isCurrent={isCurrent}
                isNext={isNextUp}
                isDone={isDone}
                hasError={isError}
                collapsible={true}
                collapsed={shouldCollapse}
                onToggleCollapse={() => {
                  if (isNextUp && !isCurrent) return;
                  setCollapsed((prev) => {
                    const arr = [...prev]
                    arr[realIdx] = !arr[realIdx]
                    return arr
                  })
                }}
              />
              {!shouldCollapse && isError && onRetry && (
                <div className="flex justify-end mt-2 mb-6">
                  <Button
                    onClick={(e) => { e.stopPropagation(); onRetry(job, realIdx); }}
                    disabled={isRetrying}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded border-0"
                  >
                    {isRetrying ? "Retrying..." : "Retry"}
                  </Button>
                </div>
              )}
            </div>
          )
        }
        return (
          <div key={`${job.jobInfo?.jobId || "job"}-${realIdx}`}>
            <JobProgress
              jobInfo={job.jobInfo}
              streamMsgs={job.streamMsgs}
              isCurrent={isCurrent}
              isNext={false}
              isDone={false}
              hasError={isError}
              collapsible={false}
            />
            {isError && onRetry && (
              <div className="flex justify-end mt-2 mb-6">
                <Button
                  onClick={() => onRetry(job, realIdx)}
                  disabled={isRetrying}
                  className="slanted-btn bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded border-0"
                >
                  {isRetrying ? "Retrying..." : "Retry"}
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
