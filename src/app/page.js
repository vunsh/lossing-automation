import Image from "next/image";
import RequireAuth from "../components/RequireAuth";
import Profile from "../components/profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Attendance from "@/components/reports/Attendance";
import Student from "@/components/reports/Student";
import Enrollment from "@/components/reports/Enrollment";
import DWP from "@/components/reports/DWP";
import Timesheet from "@/components/reports/Timesheet";
import Assessment from "@/components/reports/Assessment";
import LeadTracking from "@/components/reports/LeadTracking";
import LeadExport from "@/components/reports/LeadExport";
import Activities from "@/components/reports/Activities";

export default function Home() {
  return (
    <RequireAuth>
      <header className="fixed top-0 left-0 w-full h-14 bg-black flex items-center justify-between z-20 shadow-md px-6">
        <div className="text-white text-xl font-bold tracking-tight font-mono">
          lossing-automation
        </div>
        <div>
          <Profile />
        </div>
      </header>
      <div
        className="min-h-screen pt-20 px-4"
        style={{
          backgroundImage: 'url("/reports-background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="Attendance" className="w-full">
            <TabsList className="mb-6 mx-auto flex-wrap">
              <TabsTrigger value="Attendance">Attendance</TabsTrigger>
              <TabsTrigger value="Student">Student</TabsTrigger>
              <TabsTrigger value="Enrollment">Enrollment</TabsTrigger>
              <TabsTrigger value="DWP">DWP</TabsTrigger>
              <TabsTrigger value="Timesheet">Timesheet</TabsTrigger>
              <TabsTrigger value="Assessment">Assessment</TabsTrigger>
              <TabsTrigger value="LeadTracking">Lead Tracking</TabsTrigger>
              <TabsTrigger value="LeadExport">Lead Export</TabsTrigger>
              <TabsTrigger value="Activities">Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="Attendance">
              <Attendance />
            </TabsContent>
            <TabsContent value="Student">
              <Student />
            </TabsContent>
            <TabsContent value="Enrollment">
              <Enrollment />
            </TabsContent>
            <TabsContent value="DWP">
              <DWP />
            </TabsContent>
            <TabsContent value="Timesheet">
              <Timesheet />
            </TabsContent>
            <TabsContent value="Assessment">
              <Assessment />
            </TabsContent>
            <TabsContent value="LeadTracking">
              <LeadTracking />
            </TabsContent>
            <TabsContent value="LeadExport">
              <LeadExport />
            </TabsContent>
            <TabsContent value="Activities">
              <Activities />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  );
}
