import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp } from "lucide-react"

export function JobProgressBar({ progress, isCurrent, isDone, hasError }) {
  return (
    <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden mb-2 relative">
      <div
        className={`h-full transition-all duration-300 ${
          hasError
            ? "bg-yellow-400"
            : isDone
            ? "bg-green-600"
            : "bg-red-500"
        } ${isCurrent && !isDone && !hasError ? "animate-pulse" : ""}`}
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  )
}

export function JobProgress({
  jobInfo,
  streamMsgs = [],
  isCurrent = false,
  isDone = false,
  isNext = false,
  hasError = false,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
}) {
  const progress =
    streamMsgs.length > 0
      ? streamMsgs[streamMsgs.length - 1]?.progress ?? (isDone ? 100 : 0)
      : 0

  const errorMsg = streamMsgs.find((msg) => msg.error)

  const reversedMsgs = [...streamMsgs].reverse()

  const borderColor = hasError
    ? "border-yellow-400"
    : isCurrent
    ? "border-red-500"
    : isDone
    ? "border-green-600"
    : isNext
    ? "border-yellow-400"
    : "border-neutral-700"

  return (
    <div
      className={`relative px-0 py-0 mb-4 shadow bg-neutral-900/80 border rounded-xl ${borderColor}`}
    >
      {collapsible ? (
        <button
          type="button"
          className="flex items-center w-full px-4 py-3 focus:outline-none group rounded-xl justify-between"
          onClick={onToggleCollapse}
          tabIndex={0}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-red-500">
              {jobInfo.report?.toUpperCase()}
            </span>
            <span className="text-neutral-400 text-sm ml-2">({jobInfo.region})</span>
            {isCurrent && !hasError && (
              <span className="ml-2 px-2 py-0.5 rounded bg-red-500 text-white text-xs font-semibold">
                Running
              </span>
            )}
            {isNext && !hasError && (
              <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-semibold">
                Next
              </span>
            )}
            {isDone && !hasError && (
              <span className="ml-2 px-2 py-0.5 rounded bg-green-600 text-white text-xs font-semibold">
                Done
              </span>
            )}
            {hasError && (
              <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-semibold">
                Failed
              </span>
            )}
          </div>
          <span className="ml-3 text-neutral-400 flex items-center">
            {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-2 px-6 pt-4 mb-1">
          <span className="font-bold text-lg text-red-500">
            {jobInfo.report?.toUpperCase()}
          </span>
          <span className="text-neutral-400 text-sm">({jobInfo.region})</span>
          {isCurrent && !hasError && (
            <span className="ml-2 px-2 py-0.5 rounded bg-red-500 text-white text-xs font-semibold">
              Running
            </span>
          )}
          {isNext && !hasError && (
            <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-semibold">
              Next
            </span>
          )}
          {isDone && !hasError && (
            <span className="ml-2 px-2 py-0.5 rounded bg-green-600 text-white text-xs font-semibold">
              Done
            </span>
          )}
          {hasError && (
            <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-black text-xs font-semibold">
              Failed
            </span>
          )}
        </div>
      )}
      <div
        className={`collapsible-content ${collapsible ? (collapsed ? 'collapsed' : 'expanded') : ''}`}
      >
        {!(collapsible && collapsed) && (
          <div className="px-2 pb-4">
            <JobProgressBar
              progress={progress}
              isCurrent={isCurrent}
              isDone={isDone}
              hasError={hasError}
            />
            <div className="text-xs text-neutral-300 mb-1">
              Job ID: <span className="font-mono">{jobInfo.jobId}</span>
            </div>
            <ScrollArea className="h-32 bg-neutral-800 rounded p-2 text-xs text-neutral-200">
              {reversedMsgs.length === 0 && <div>No updates yet.</div>}
              {reversedMsgs.map((msg, idx) => (
                <div
                  key={reversedMsgs.length - idx - 1}
                  className={`mb-1 ${msg.error ? "text-yellow-400 font-semibold" : ""}`}
                >
                  {msg.message || msg.error || JSON.stringify(msg)}
                  {typeof msg.progress === "number" && (
                    <span className="ml-2 text-neutral-400">({msg.progress}%)</span>
                  )}
                  {msg.error && msg.details && (
                    <div className="text-xs text-yellow-300 mt-1">{msg.details}</div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
