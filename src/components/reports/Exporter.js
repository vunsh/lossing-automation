"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const exporterSchema = z.object({
  reportsToExport: z.array(z.string()).nonempty({
    message: "You must select at least one report to export.",
  }),
  exportFormat: z.string().nonempty({
    message: "Export format is required.",
  }),
});

export default function Exporter() {
  const form = useForm({
    resolver: zodResolver(exporterSchema),
    defaultValues: {
      reportsToExport: [],
      exportFormat: "",
    },
  });

  const onSubmit = (values) => {
    console.log("Exporter form submitted:", values);
    // Add API call logic here
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 sm:p-8 bg-black/40 rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="reportsToExport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reports to Export</FormLabel>
              <FormControl>
                <Select
                  multiple
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Enrollment">Enrollment</SelectItem>
                    <SelectItem value="DWP">DWP</SelectItem>
                    <SelectItem value="Timesheet">Timesheet</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="LeadTracking">Lead Tracking</SelectItem>
                    <SelectItem value="LeadExport">Lead Export</SelectItem>
                    <SelectItem value="Activities">Activities</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exportFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Export Format</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="primary" className="w-full">
          Export Reports
        </Button>
      </form>
    </Form>
  );
}
