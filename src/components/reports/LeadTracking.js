import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronsUpDown, Check } from "lucide-react"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Helper to get one month before today
function getOneMonthAgo() {
  const d = new Date()
  d.setMonth(d.getMonth() - 3)
  return d
}

export const leadTrackingFilterElements = [
  {
    id: "ReportStart",
    label: "Start Date",
    type: "date",
    default: getOneMonthAgo(),
  },
  {
    id: "ReportEnd",
    label: "End Date",
    type: "date",
    default: null,
  },
  {
    id: "ConversionStatusDropDownList",
    label: "Conversion Status",
    type: "dropdown",
    options: [
      { label: "All", value: "All" },
      { label: "Converted", value: "Converted" },
      { label: "Unconverted", value: "Unconverted" },
    ],
    default: "All",
  },
  {
    id: "LeadStatusMulti",
    label: "Lead Status",
    type: "multi",
    options: [
      { label: "Open", value: "Open" },
      { label: "Contacted", value: "Contacted" },
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
      { label: "Visited", value: "Visited" },
      { label: "Assessment Pending", value: "Assessment Pending" },
      { label: "Assessed", value: "Assessed" },
      { label: "Assessed - Declined Enrollment", value: "Assessed - Declined Enrollment" },
      { label: "Enrolled", value: "Enrolled" },
      { label: "Hold", value: "Hold" },
      { label: "Mail Only", value: "Mail Only" },
      { label: "Do Not Contact", value: "Do Not Contact" },
    ],
    default: [],
  },
]

export function getLeadTrackingDefaults() {
  const defaults = {}
  for (const el of leadTrackingFilterElements) {
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

export default function LeadTracking({ control }) {
  const [openDropdown, setOpenDropdown] = useState({})
  const [openMulti, setOpenMulti] = useState({})

  useEffect(() => {
    const setValue = control?._formContext?.setValue
    if (!setValue) return
    leadTrackingFilterElements.forEach((el) => {
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
        {leadTrackingFilterElements.slice(0, 2).map((el) => (
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
      <div className="flex gap-4">
        <FormField
          key={leadTrackingFilterElements[2].id}
          name={leadTrackingFilterElements[2].id}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-cyan-200">{leadTrackingFilterElements[2].label}</FormLabel>
              <FormControl>
                <Popover
                  open={!!openDropdown[leadTrackingFilterElements[2].id]}
                  onOpenChange={(open) =>
                    setOpenDropdown((prev) => ({
                      ...prev,
                      [leadTrackingFilterElements[2].id]: open,
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.value && "text-muted-foreground"
                      )}
                    >
                      {field.value?.value
                        ? leadTrackingFilterElements[2].options.find(
                            (o) => o.value === field.value.value
                          )?.label
                        : leadTrackingFilterElements[2].default
                        ? leadTrackingFilterElements[2].options.find(
                            (o) => o.value === leadTrackingFilterElements[2].default
                          )?.label
                        : `Select ${leadTrackingFilterElements[2].label}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${leadTrackingFilterElements[2].label.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                          {leadTrackingFilterElements[2].options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                field.onChange({
                                  id: leadTrackingFilterElements[2].id,
                                  type: leadTrackingFilterElements[2].type,
                                  value: option.value,
                                })
                                setOpenDropdown((prev) => ({
                                  ...prev,
                                  [leadTrackingFilterElements[2].id]: false,
                                }))
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.value?.value === option.value
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          control={control}
        />
        <FormField
          key={leadTrackingFilterElements[3].id}
          name={leadTrackingFilterElements[3].id}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-cyan-200">{leadTrackingFilterElements[3].label}</FormLabel>
              <FormControl>
                <Popover
                  open={!!openMulti[leadTrackingFilterElements[3].id]}
                  onOpenChange={(open) =>
                    setOpenMulti((prev) => ({
                      ...prev,
                      [leadTrackingFilterElements[3].id]: open,
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.value?.length
                        ? leadTrackingFilterElements[3].options
                            .filter((o) => field.value.value.includes(o.value))
                            .map((o) => o.label)
                            .join(", ")
                        : "Select sources"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${leadTrackingFilterElements[3].label.toLowerCase()}...`}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                          {leadTrackingFilterElements[3].options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                let newValue = Array.isArray(field.value?.value)
                                  ? [...field.value.value]
                                  : []
                                if (newValue.includes(option.value)) {
                                  newValue = newValue.filter((v) => v !== option.value)
                                } else {
                                  newValue.push(option.value)
                                }
                                field.onChange({
                                  id: leadTrackingFilterElements[3].id,
                                  type: leadTrackingFilterElements[3].type,
                                  value: newValue,
                                })
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  Array.isArray(field.value?.value) &&
                                    field.value.value.includes(option.value)
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          control={control}
        />
      </div>
    </div>
  )
}
