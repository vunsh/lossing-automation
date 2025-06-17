"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createContext, useContext, useState } from "react";
import Attendance from "@/components/reports/Attendance";
import Student from "@/components/reports/Student";
import Enrollment from "@/components/reports/Enrollment";
import DWP from "@/components/reports/DWP";
import Timesheet from "@/components/reports/Timesheet";
import Assessment from "@/components/reports/Assessment";
import LeadTracking from "@/components/reports/LeadTracking";
import LeadExport from "@/components/reports/LeadExport";
import Activities from "@/components/reports/Activities";
import Exporter from "@/components/reports/Exporter";
import {
  Download,
  CalendarCheck,
  User,
  Users,
  Dumbbell,
  Clock,
  FileText,
  TrendingUp,
  Upload,
  Activity,
} from "lucide-react";

// Create a context for form state
const FormContext = createContext(null);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContext.Provider");
  }
  return context;
}

const tabs = [
  {
    name: "Exporter",
    value: "Exporter",
    icon: Download,
    content: <Exporter />,
  },
  {
    name: "Attendance",
    value: "Attendance",
    icon: CalendarCheck,
    content: <Attendance />,
  },
  {
    name: "Student",
    value: "Student",
    icon: User,
    content: <Student />,
  },
  {
    name: "Enrollment",
    value: "Enrollment",
    icon: Users,
    content: <Enrollment />,
  },
  {
    name: "DWP",
    value: "DWP",
    icon: Dumbbell,
    content: <DWP />,
  },
  {
    name: "Timesheet",
    value: "Timesheet",
    icon: Clock,
    content: <Timesheet />,
  },
  {
    name: "Assessment",
    value: "Assessment",
    icon: FileText,
    content: <Assessment />,
  },
  {
    name: "Lead Tracking",
    value: "LeadTracking",
    icon: TrendingUp,
    content: <LeadTracking />,
  },
  {
    name: "Lead Export",
    value: "LeadExport",
    icon: Upload,
    content: <LeadExport />,
  },
  {
    name: "Activities",
    value: "Activities",
    icon: Activity,
    content: <Activities />,
  },
];

export default function ReportsTabs() {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add API call logic here
  };

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-12">
        <Tabs
          orientation="vertical"
          defaultValue={tabs[0].value}
          className="flex flex-col sm:flex-row items-start w-full"
        >
          <TabsList
            className="
              flex flex-row sm:flex-col w-full sm:w-64 p-0
              bg-transparent
              h-fit items-stretch
              gap-2 sm:gap-3
              overflow-x-auto sm:overflow-visible
              scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300
            "
          >
            {tabs.map((tabItem) => (
              <TabsTrigger
                key={tabItem.value}
                value={tabItem.value}
                className={`
                  w-auto sm:w-full text-left justify-start
                  border-b-2 sm:border-l-4 border-transparent
                  data-[state=active]:border-[#ff003c55]
                  data-[state=active]:bg-[#ff003c08]
                  data-[state=active]:text-[#ff003c99]
                  data-[state=active]:shadow-[0_1px_4px_0_#ff003c22]
                  py-2 sm:py-4 px-4 sm:px-7 flex items-center gap-2 sm:gap-4
                  font-bold text-sm sm:text-lg
                  transition-all duration-150
                  hover:bg-[#ff003c11] hover:text-[#ff003c] hover:shadow-md hover:scale-[1.02]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c77]
                  text-white/70
                  data-[state=inactive]:bg-white/5
                  data-[state=inactive]:text-white/70
                  data-[state=inactive]:shadow-sm
                  data-[state=inactive]:border-b-white/10 sm:data-[state=inactive]:border-l-white/10
                  data-[state=inactive]:hover:border-[#ff003c55]
                  rounded-md sm:rounded-xl
                  overflow-hidden
                  z-0
                  relative
                  border border-white/10
                `}
                style={{
                  letterSpacing: "0.02em",
                }}
              >
                <tabItem.icon className="h-5 sm:h-7 w-5 sm:w-7 mr-2 sm:mr-3 opacity-70 data-[state=active]:opacity-85 transition-opacity" />
                {tabItem.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 font-medium text-muted-foreground flex items-center justify-center min-h-[10rem] sm:min-h-[12rem] bg-black/40 shadow-lg p-6 sm:p-12 overflow-hidden rounded-lg sm:rounded-2xl">
            {tabs.map((tabItem) => (
              <TabsContent
                key={tabItem.value}
                value={tabItem.value}
                className="w-full"
              >
                {tabItem.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
        <div className="w-full flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Export Reports
          </button>
        </div>
      </div>
    </FormContext.Provider>
  );
}
