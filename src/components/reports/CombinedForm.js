"use client";

import { useState } from "react";
import Exporter from "./Exporter";
import ReportsForm from "./ReportsForm";
import { ListChecks, SlidersHorizontal } from "lucide-react";
import { submitAllReportsSequential } from "@/lib/handleSubmit";
import { JobProgressList } from "../submit/JobProgressList";
import Success from "../submit/Success";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function StepTwo({ onBack, formValues, onSubmitFilters }) {
  const selectedReports = formValues?.reports || [];

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full">
        <ReportsForm
          reports={selectedReports}
          initialData={formValues}
          onSubmit={onSubmitFilters}
          onBack={() => onBack(formValues)}
        />
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12 w-full max-w-xs mx-auto">
      {/* Step 1 */}
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 flex items-center justify-center rounded-full border-2 shadow transition-all duration-300 ${
            step === 1
              ? "border-red-500 bg-neutral-900 text-red-500 scale-105"
              : "border-neutral-700 bg-neutral-800 text-neutral-500"
          }`}
        >
          <ListChecks
            className={`w-4 h-4 transition-colors duration-300 ${
              step === 1 ? "text-red-500" : "text-neutral-500"
            }`}
          />
        </div>
        <span
          className={`text-xs mt-1 font-medium ${
            step === 1 ? "text-red-500" : "text-neutral-500"
          }`}
        >
          Select
        </span>
      </div>
      <div className="relative flex-1 h-1 w-12">
        <div className="absolute top-0 left-0 h-1 w-full rounded-full bg-neutral-700 transition-colors duration-500" />
        <div
          className={`absolute top-0 left-0 h-1 rounded-full transition-all duration-500 ${
            step === 2 ? "bg-red-500 w-full" : "bg-red-500 w-0"
          }`}
          style={{
            transitionProperty: "width, background-color",
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 flex items-center justify-center rounded-full border-2 shadow transition-all duration-300 ${
            step === 2
              ? "border-red-500 bg-neutral-900 text-red-500 scale-105"
              : "border-neutral-700 bg-neutral-800 text-neutral-500"
          }`}
        >
          <SlidersHorizontal
            className={`w-4 h-4 transition-colors duration-300 ${
              step === 2 ? "text-red-500" : "text-neutral-500"
            }`}
          />
        </div>
        <span
          className={`text-xs mt-1 font-medium ${
            step === 2 ? "text-red-500" : "text-neutral-500"
          }`}
        >
          Confirm
        </span>
      </div>
    </div>
  );
}

function ErrorDisplay({ errorJob, onRetry, isRetrying, onCancel }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="text-xl font-bold text-red-500 mb-2">Cancel and Reset?</div>
        <div className="text-base text-neutral-200 mb-4">
          Are you sure you want to cancel and reset? All progress will be lost.
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Yes, Reset
          </Button>
          <Button
            onClick={() => setShowConfirm(false)}
            variant="outline"
            className="font-semibold px-6 py-2 rounded-lg"
          >
            No, Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <AlertTriangle className="w-14 h-14 text-yellow-400 mb-3" />
      <div className="text-xl font-bold text-yellow-400 mb-2">Job Failed</div>
      <div className="text-base text-neutral-200 mb-2">
        {errorJob?.error?.error || "An error occurred."}
      </div>
      {errorJob?.error?.details && (
        <pre className="bg-neutral-900/80 rounded p-3 text-xs text-yellow-200 mb-4 max-w-xl overflow-x-auto">
          {errorJob.error.details}
        </pre>
      )}
      <div className="flex gap-4">
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg"
        >
          Retry
        </Button>
        <Button
          onClick={() => setShowConfirm(true)}
          variant="outline"
          className="font-semibold px-6 py-2 rounded-lg"
        >
          Cancel
        </Button>
      </div>
      {isRetrying && (
        <div className="mt-3 text-yellow-300 text-sm font-semibold">
          Retrying...
        </div>
      )}
    </div>
  );
}

export default function CombinedForm() {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({ reports: [], regions: [] });

  // Job progress state
  const [jobs, setJobs] = useState([]); 
  const [currentJobIdx, setCurrentJobIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [errorJob, setErrorJob] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const descriptions = {
    1: "Select the report(s) and region(s) you want to export data for.",
    2: "Select any filters you want to apply for each report. Leave everything as is to export data with the default settings needed for Lossing Reports.",
  };

  function getPendingJobs(jobsArr, failedIdx) {
    // Only jobs after the failed one (failedIdx) are pending
    return jobsArr.slice(failedIdx + 1).map((j) => ({
      report: j.jobInfo.report,
      region: j.jobInfo.region,
    }));
  }

  // Helper to get the jobInfo for the failed job
  function getFailedJobInfo(jobsArr, currentIdx) {
    if (!jobsArr[currentIdx]) return null;
    return jobsArr[currentIdx].jobInfo;
  }

  async function runJobsSequential(data, startIdx = 0, pendingJobs = []) {
    setIsRunning(true);
    setAllDone(false);
    setErrorJob(null);

    // Prepare the jobs to run either from pendingJobs or from formData
    let jobsToRun = [];
    if (pendingJobs && pendingJobs.length > 0) {
      jobsToRun = pendingJobs;
    } else {
      const reports = data.initialData?.reports || [];
      const regions = data.initialData?.regions || [];
      for (const report of reports) {
        for (const region of regions) {
          jobsToRun.push({ report, region });
        }
      }
    }

    let completedJobs = startIdx > 0 ? jobs.slice(0, startIdx) : [];

    let idx = 0;
    for (; idx < jobsToRun.length; idx++) {
      const { report, region } = jobsToRun[idx];
      const filterArr = data.filters?.[report]
        ? Object.values(data.filters[report])
        : [];
      let jobInfo = null;
      let streamMsgs = [];
      let error = null;

      await submitAllReportsSequential(
        {
          filters: { [report]: data.filters?.[report] || {} },
          initialData: { reports: [report], regions: [region] },
        },
        (ji, streamMsg) => {
          jobInfo = ji;
          streamMsgs = [...streamMsgs, streamMsg];
          setJobs((prev) => {
            let newJobs = [...completedJobs, { jobInfo, streamMsgs }];
            return newJobs;
          });
          setCurrentJobIdx(completedJobs.length);
          if (streamMsg && streamMsg.error) {
            error = { error: streamMsg };
          }
        },
        (ji, allStreamMsgs) => {
          jobInfo = ji;
          streamMsgs = allStreamMsgs;
        }
      );

      if (streamMsgs.some((msg) => msg.error)) {
        setErrorJob({
          jobInfo,
          streamMsgs,
          error: streamMsgs.find((msg) => msg.error),
          failedIdx: completedJobs.length,
        });
        setIsRunning(false);
        setAllDone(false);
        setJobs([...completedJobs, { jobInfo, streamMsgs }]);
        setCurrentJobIdx(completedJobs.length);
        return;
      }

      completedJobs = [...completedJobs, { jobInfo, streamMsgs }];
    }

    setJobs(completedJobs);
    setIsRunning(false);
    setAllDone(true);
  }

  async function handleFiltersSubmit(data) {
    setJobs([]);
    setCurrentJobIdx(0);
    setAllDone(false);
    setErrorJob(null);
    await runJobsSequential(data, 0, []);
  }

  async function handleRetry() {
    if (!errorJob) return;
    setIsRetrying(true);

    const failedIdx = errorJob.failedIdx ?? currentJobIdx;
    const pending = getPendingJobs(jobs, failedIdx);
    const retryJobs = [
      {
        report: errorJob.jobInfo.report,
        region: errorJob.jobInfo.region,
      },
      ...pending,
    ];
    setJobs(jobs.slice(0, failedIdx));
    setCurrentJobIdx(failedIdx);

    await runJobsSequential(
      { filters: formValues.filters, initialData: formValues.initialData },
      0,
      retryJobs
    );
    setIsRetrying(false);
  }

  function handleRetryJob(job, idx) {
    setErrorJob({
      jobInfo: job.jobInfo,
      streamMsgs: job.streamMsgs,
      error: job.streamMsgs.find((msg) => msg.error),
      failedIdx: idx,
    });
  }

  function handleReset() {
    setStep(1);
    setFormValues({ reports: [], regions: [] });
    setJobs([]);
    setCurrentJobIdx(0);
    setIsRunning(false);
    setAllDone(false);
    setErrorJob(null);
    setIsRetrying(false);
  }

  return (
    <div
      className="backdrop-blur-lg bg-neutral-900/80 border border-neutral-800 shadow-2xl rounded-3xl px-12 py-14 max-w-2xl mx-auto mt-24 flex flex-col items-center"
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(0,0,0,0.45), 0 1.5px 8px 0 rgba(255,0,0,0.08)",
      }}
    >
      <div className="text-3xl font-extrabold text-red-500 mb-2 drop-shadow-lg tracking-tight text-center">
        Export Report
      </div>
      <div className="text-base text-neutral-300 mb-8 text-center max-w-lg">
        {isRunning
          ? "Running report jobs. Progress and messages will appear below."
          : allDone
          ? "All jobs complete!"
          : errorJob
          ? "A job failed. Please try again."
          : descriptions[step]}
      </div>
      <Stepper step={step} />
      <div className="w-full max-w-lg">
        {errorJob ? (
          <ErrorDisplay
            errorJob={errorJob}
            onRetry={handleRetry}
            isRetrying={isRetrying}
            onCancel={handleReset}
          />
        ) : isRunning || (jobs.length > 0 && !allDone) ? (
          <JobProgressList
            jobs={jobs}
            currentIdx={currentJobIdx}
            onRetry={handleRetryJob}
            isRetrying={isRetrying}
          />
        ) : allDone ? (
          <div>
            <Success jobs={jobs} />
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
                onClick={handleReset}
              >
                Start Over
              </Button>
            </div>
          </div>
        ) : step === 1 ? (
          <Exporter
            onNext={(data) => {
              setFormValues(data);
              setStep(2);
            }}
            initialValues={formValues}
          />
        ) : (
          <StepTwo
            onBack={(vals) => {
              setFormValues(vals || formValues);
              setStep(1);
            }}
            formValues={formValues}
            onSubmitFilters={handleFiltersSubmit}
          />
        )}
      </div>
    </div>
  );
}

