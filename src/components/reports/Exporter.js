"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const reports = [
  { label: "Attendance", value: "attendance" },
  { label: "Assessment", value: "assessment" },
  { label: "Activities", value: "activities" },
  { label: "DWP", value: "dwp" },
  { label: "Enrollment", value: "enrollment" },
  { label: "Lead Export", value: "leadexport" },
  { label: "Lead Tracking", value: "leadtracking" },
  { label: "Student", value: "student" },
  { label: "Timesheet", value: "timesheet" },
]

const regions = [
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Arizona", value: "AZ" },
  { label: "Texas", value: "TX" },
  { label: "Ohio", value: "OH" },
]

const FormSchema = z.object({
  reports: z
    .array(z.string())
    .min(1, "Please select at least one report."),
  regions: z
    .array(z.string())
    .min(1, "Please select at least one region."),
})

export default function Exporter({ onNext, initialValues }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues || { reports: [], regions: [] },
    values: initialValues, 
  })
  const [openReports, setOpenReports] = useState(false)
  const [openRegions, setOpenRegions] = useState(false)

  function onSubmit(data) {
    if (onNext) onNext(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md"
      >
        <div className="flex items-stretch gap-6">
          <div className="flex flex-col flex-1 justify-between space-y-8">
            <FormField
              control={form.control}
              name="reports"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center mb-1 gap-2">
                    <FormLabel className="text-2xl font-extrabold text-red-500 tracking-tight drop-shadow-lg">
                      Reports
                    </FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs px-2 py-0 h-6 rounded border border-red-500 text-red-500 hover:bg-red-500/10 ml-2"
                      onClick={() => field.onChange(reports.map(r => r.value))}
                      tabIndex={-1}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs px-2 py-0 h-6 rounded border border-neutral-500 text-neutral-400 hover:bg-neutral-700/20 ml-1"
                      onClick={() => field.onChange([])}
                      tabIndex={-1}
                    >
                      Reset
                    </Button>
                  </div>
                  <Popover open={openReports} onOpenChange={setOpenReports}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[300px] justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length
                            ? reports
                                .filter(r => field.value.includes(r.value))
                                .map(r => r.label)
                                .join(", ")
                            : "Select reports"}
                          <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search reports..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No report found.</CommandEmpty>
                          <CommandGroup>
                            {reports.map((report) => (
                              <CommandItem
                                key={report.value}
                                value={report.label}
                                onSelect={() => {
                                  const exists = field.value?.includes(report.value)
                                  if (exists) {
                                    field.onChange(field.value.filter(v => v !== report.value))
                                  } else {
                                    field.onChange([...(field.value || []), report.value])
                                  }
                                }}
                              >
                                {report.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value?.includes(report.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select one or more reports to export.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regions"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center mb-1 gap-2">
                    <FormLabel className="text-2xl font-extrabold text-red-500 tracking-tight drop-shadow-lg">
                      Regions
                    </FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs px-2 py-0 h-6 rounded border border-red-500 text-red-500 hover:bg-red-500/10 ml-2"
                      onClick={() => field.onChange(regions.map(r => r.value))}
                      tabIndex={-1}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs px-2 py-0 h-6 rounded border border-neutral-500 text-neutral-400 hover:bg-neutral-700/20 ml-1"
                      onClick={() => field.onChange([])}
                      tabIndex={-1}
                    >
                      Reset
                    </Button>
                  </div>
                  <Popover open={openRegions} onOpenChange={setOpenRegions}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[300px] justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length
                            ? regions
                                .filter(r => field.value.includes(r.value))
                                .map(r => r.label)
                                .join(", ")
                            : "Select regions"}
                          <ChevronsUpDown className="ml-2 opacity-50 shrink-0" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search regions..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No region found.</CommandEmpty>
                          <CommandGroup>
                            {regions.map((region) => (
                              <CommandItem
                                key={region.value}
                                value={region.label}
                                onSelect={() => {
                                  const exists = field.value?.includes(region.value)
                                  if (exists) {
                                    field.onChange(field.value.filter(v => v !== region.value))
                                  } else {
                                    field.onChange([...(field.value || []), region.value])
                                  }
                                }}
                              >
                                {region.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value?.includes(region.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select one or more regions to export.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center pl-24">
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center rounded-lg shadow-lg transition gap-2 px-4 py-2 text-sm min-w-[40px] min-h-[36px]"
              aria-label="Next"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}


