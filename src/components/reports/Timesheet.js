import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function getPrevMonthFirstDay() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export const timesheetFilterElements = [
  {
    id: "TimesheetStartDate",
    label: "Start Date",
    type: "date",
    default: getPrevMonthFirstDay(),
  },
  {
    id: "TimesheetEndDate",
    label: "End Date",
    type: "date",
    default: getYesterday(),
  },
]

export function getTimesheetDefaults() {
  const defaults = {}
  for (const el of timesheetFilterElements) {
    if (el.default !== undefined) {
      defaults[el.id] = {
        id: el.id,
        type: el.type,
        value: el.default,
      }
    }
  }
  return defaults
}

export default function TimesheetFilters({ control }) {
  useEffect(() => {
    const setValue = control?._formContext?.setValue
    if (!setValue) return
    timesheetFilterElements.forEach((el) => {
      const fieldValue = control._formValues?.[el.id]
      if (
        el.default !== undefined &&
        (fieldValue === undefined || fieldValue?.value === undefined)
      ) {
        setValue(
          el.id,
          {
            id: el.id,
            type: el.type,
            value: el.default,
          },
          { shouldDirty: false }
        )
      }
    })
  }, [control])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {timesheetFilterElements.map((el) => (
          <FormField
            key={el.id}
            name={el.id}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-cyan-200">{el.label}</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value?.value && "text-muted-foreground"
                        )}
                      >
                        {field.value?.value
                          ? format(
                              typeof field.value.value === "string"
                                ? new Date(field.value.value)
                                : field.value.value,
                              "PPP"
                            )
                          : el.default
                          ? format(
                              typeof el.default === "string"
                                ? new Date(el.default)
                                : el.default,
                              "PPP"
                            )
                          : `Pick a date`}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value?.value
                            ? typeof field.value.value === "string"
                              ? new Date(field.value.value)
                              : field.value.value
                            : el.default
                            ? typeof el.default === "string"
                              ? new Date(el.default)
                              : el.default
                            : undefined
                        }
                        onSelect={(date) =>
                          field.onChange({
                            id: el.id,
                            type: el.type,
                            value: date,
                          })
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            control={control}
          />
        ))}
      </div>
    </div>
  )
}
