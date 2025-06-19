"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useMemo } from "react"
import AttendanceFilters, { getAttendanceDefaults } from "./Attendance"
import DWPFilters, { getDWPDefaults, dwpFilterElements } from "./DWP"
import EnrollmentFilters, { getEnrollmentDefaults, enrollmentFilterElements } from "./Enrollment"
import LeadExportFilters, { getLeadExportDefaults, leadExportFilterElements } from "./LeadExport"
import LeadTracking, { getLeadTrackingDefaults, leadTrackingFilterElements } from "./LeadTracking"
import { ScrollArea } from "@/components/ui/scroll-area"
import Assessment, { getAssessmentDefaults, assessmentFilterElements } from "./Assessment"
import { z as zod } from "zod"



function ActivitiesFilters({ control }) { return null } // will be replaced when i get around to it

import { attendanceFilterElements } from "./Attendance"

function getAttendanceSchema(z = zod) {
  const shape = {}
  for (const el of attendanceFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value:
          el.type === "date"
            ? z.any().nullable().optional()
            : z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

function getDWPSchema(z = zod) {
  const shape = {}
  for (const el of dwpFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value:
          el.type === "date"
            ? z.any().nullable().optional()
            : z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

function getEnrollmentSchema(z = zod) {
  const shape = {}
  for (const el of enrollmentFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value: z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

function getLeadExportSchema(z = zod) {
  const shape = {}
  for (const el of leadExportFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value: el.type === "date"
          ? z.any().nullable().optional()
          : z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

function getLeadTrackingSchema(z = zod) {
  const shape = {}
  for (const el of leadTrackingFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value:
          el.type === "date"
            ? z.any().nullable().optional()
            : (el.type === "multi" && z.array ? z.array(z.string()).optional() : z.string().optional()),
      })
      .optional()
  }
  return z.object(shape)
}

function getAssessmentSchema(z = zod) {
  const shape = {}
  for (const el of assessmentFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value:
          el.type === "date"
            ? z.any().nullable().optional()
            : (el.type === "multi" && z.array ? z.array(z.string()).optional() : z.string().optional()),
      })
      .optional()
  }
  return z.object(shape)
}

import StudentFilters, { getStudentDefaults, studentFilterElements } from "./Student"

function getStudentSchema(z = zod) {
  const shape = {}
  for (const el of studentFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value: el.type === "date"
          ? z.any().nullable().optional()
          : z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

import TimesheetFilters, { getTimesheetDefaults, timesheetFilterElements } from "./Timesheet"

function getTimesheetSchema(z = zod) {
  const shape = {}
  for (const el of timesheetFilterElements) {
    shape[el.id] = z
      .object({
        id: z.literal(el.id),
        type: z.literal(el.type),
        value: el.type === "date"
          ? z.any().nullable().optional()
          : z.string().optional(),
      })
      .optional()
  }
  return z.object(shape)
}

// Map diff keys to their report comps and zod schemas
const reportFilterMap = {
  attendance: {
    component: AttendanceFilters,
    schema: getAttendanceSchema,
  },
  dwp: {
    component: DWPFilters,
    schema: getDWPSchema,
  },
  enrollment: {
    component: EnrollmentFilters,
    schema: getEnrollmentSchema,
  },
  leadexport: {
    component: LeadExportFilters,
    schema: getLeadExportSchema,
  },
  leadtracking: {
    component: LeadTracking,
    schema: getLeadTrackingSchema,
  },
  assessment: {
    component: Assessment,
    schema: getAssessmentSchema,
  },
  activities: {
    component: ActivitiesFilters,
    schema: (z) => z.object({}),
  },
  student: {
    component: StudentFilters,
    schema: getStudentSchema,
  },
  timesheet: {
    component: TimesheetFilters,
    schema: getTimesheetSchema,
  },
}

// function to actually display form for the selected reports
export default function ReportsForm({ reports = [], onSubmit, initialData, onBack }) {
    // dynamic form schema
    const dynamicSchema = useMemo(() => {
    const shape = {}
    reports.forEach((report) => {
      if (reportFilterMap[report]) {
        shape[report] = reportFilterMap[report].schema(zod)
      }
    })
    return zod.object(shape)
  }, [reports])

  // Passing in form default values
  const defaultValues = useMemo(() => {
    const acc = {}
    reports.forEach((report) => {
      if (report === "attendance") {
        const attendanceDefaults = getAttendanceDefaults()
        acc[report] = { ...attendanceDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "dwp") {
        const dwpDefaults = getDWPDefaults()
        acc[report] = { ...dwpDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "enrollment") {
        const enrollmentDefaults = getEnrollmentDefaults()
        acc[report] = { ...enrollmentDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "leadexport") {
        const leadExportDefaults = getLeadExportDefaults()
        acc[report] = { ...leadExportDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "leadtracking") {
        const leadTrackingDefaults = getLeadTrackingDefaults()
        acc[report] = { ...leadTrackingDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "assessment") {
        const assessmentDefaults = getAssessmentDefaults()
        acc[report] = { ...assessmentDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "student") {
        const studentDefaults = getStudentDefaults()
        acc[report] = { ...studentDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else if (report === "timesheet") {
        const timesheetDefaults = getTimesheetDefaults()
        acc[report] = { ...timesheetDefaults }
        if (initialData?.[report]) {
          Object.keys(initialData[report]).forEach((key) => {
            acc[report][key] = initialData[report][key]
          })
        }
      } else {
        acc[report] = initialData?.[report] ? { ...initialData[report] } : {}
      }
    })
    return acc
  }, [reports, initialData])

  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  })

  function handleSubmit(data) {
    if (onSubmit) onSubmit({ filters: data, initialData })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <ScrollArea className="pr-2">
          {reports.map((report) => {
            const FilterComponent = reportFilterMap[report]?.component
            if (!FilterComponent) return null
            return (
              <div key={report} className="mb-10">
                <div className="text-3xl font-extrabold text-red-500 mb-6 capitalize tracking-tight drop-shadow-lg">
                  {report.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </div>
                <FilterComponent control={form.control} />
              </div>
            )
          })}
        </ScrollArea>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
          >
            Submit
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Form>
  )
}
