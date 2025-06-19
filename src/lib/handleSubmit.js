/* API INFO:

The API Root URL is stored in the ENV: API_ROOT_URL
The API supports the following endpoints:
- /api/reports/run/stream (GET)
- /api/reports/run (POST)

Each endpoint requires an APIKEY in the header or Query for authentication. Query value apiKey, key can be found in ENV: API_KEY
Each endpoint has different parameters that can be passed. Here are breakdowns on each one

run: 
The run endpoint is used to start an automation process for a specific report. It takes in the following MANDATORY parameters in it's body:
- report: The report to run, this is a string value that should match a report in reports.json
- region: The region to run the report for, this should be a two letter abbreviation of the region eg. AZ, CA, etc. 

Only ONE reigon AND report can be passed in a single request at a time. If there are multiple regions or reports passed in the form submit, MULTIPLE api requests must be made and handled

Optional Parameters:
- filter: This is an array of objects that contains the filters to apply to the report. The filter object will always have the same structure no matter the report.

The filter parameter is where all the filters that were selected in the form will be passed. The structure is as follows:
- filter: [
{
    type: String, // The type of filter, this can either be date, select, or multi
    elementId: String, // The ID of the filter element that is being filtered in the automation process. This data should be contained in the form submit.
    value: String, Array // The value of the filter, this can be a string, or array depending on the type of filter
    }
    ]
  }

- jobId: This is an optional parameter that can be used to track the job in the system. If it is not passed, a jobId will be generated automatically and passed in the response. This jobId can be used to track the progress of the report automation using the stream endpoint.

- /api/reports/run/stream:
The stream endpoint is used to get live updates on a report automation that is running. It uses query parameters to filter the results. The following parameters can be passed in the query:
 - jobId: The jobId of the report automation to track. This is a string value that should match the jobId returned in the run endpoint response.
 - apiKey: The API key to authenticate the request. This is a string value that should match the API key in the ENV: API_KEY




*/

const API_ROOT_URL = process.env.NEXT_PUBLIC_API_ROOT_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
import { format as formatDate, isDate } from "date-fns";


export function formatFilters(filtersObj) {
  if (!filtersObj) return [];
  return Object.values(filtersObj)
    .filter(f => f.value !== null && f.value !== undefined)
    .map(f => ({
      type: f.type,
      elementId: f.id,
      value:
        f.type === "date" && f.value
          ? formatDate(
              isDate(f.value) ? f.value : new Date(f.value),
              "MM/dd/yyyy"
            )
          : f.value,
    }));
}


function makeJobId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  });
}


export function streamJob(jobId, onMessage) {
  const url = new URL(`${API_ROOT_URL}/api/reports/run/stream`);
  url.searchParams.set("jobId", jobId);
  url.searchParams.set("apiKey", API_KEY);

  const eventSource = new EventSource(url.toString());

  eventSource.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      onMessage(msg);
    } catch (e) {
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
  };

  return () => eventSource.close();
}

export async function submitAllReportsSequential(formData, onJobUpdate, onJobDone) {
  const { filters, initialData } = formData;
  const reports = initialData?.reports || [];
  const regions = initialData?.regions || [];
  const results = [];

  for (const report of reports) {
    for (const region of regions) {
      const filterArr = formatFilters(filters?.[report]);
      const jobId = makeJobId();
      const body = {
        report,
        region,
        jobId,
      };
      if (filterArr.length > 0) {
        body.filter = filterArr;
      }
      const res = await fetch(`${API_ROOT_URL}/api/reports/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const jobInfo = { report, region, jobId, response: data };
      const streamMsgs = [];
      await new Promise((resolve) => {
        const stop = streamJob(jobId, (msg) => {
          streamMsgs.push(msg);
          if (onJobUpdate) onJobUpdate(jobInfo, msg);
          if (msg.done || (msg.message && msg.message.includes("completed"))) {
            if (onJobDone) onJobDone(jobInfo, streamMsgs);
            stop();
            resolve();
          }
        });
      });
      results.push({ ...jobInfo, stream: streamMsgs });
    }
  }
  return results;
}