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

function get3MonthsAgo() {
  const d = new Date()
  d.setMonth(d.getMonth() - 3)
  return d
}

function getToday() {
  const d = new Date()
  return d
}

export const leadExportFilterElements = [
  {
    id: "startDateSelect",
    label: "Start Date",
    type: "date",
    default: get3MonthsAgo(),
  },
  {
    id: "endDateSelect",
    label: "End Date",
    type: "date",
    default: getToday(),
  },
  {
    id: "filtersDropDownList",
    label: "Lead Filters",
    type: "dropdown",
    options: [
      { label: "None", value: "None" },
      { label: "Recently Created", value: "Recently Created" },
      { label: "Recently Modified", value: "Recently Modified" },
      { label: "With Open Activities", value: "With Open Activities" },
      { label: "Without Open Activities", value: "Without Open Activities" },
    ],
    default: "None",
  },
]

export function getLeadExportDefaults() {
  const defaults = {}
  for (const el of leadExportFilterElements) {
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

export default function LeadExportFilters({ control }) {
  const [openDropdown, setOpenDropdown] = useState({})

  useEffect(() => {
    const setValue = control._formContext?.setValue
    if (!setValue) return
    leadExportFilterElements.forEach((el) => {
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
        {leadExportFilterElements.slice(0, 2).map((el) => (
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
      <FormField
        key={leadExportFilterElements[2].id}
        name={leadExportFilterElements[2].id}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel className="text-cyan-200">{leadExportFilterElements[2].label}</FormLabel>
            <FormControl>
              <Popover
                open={!!openDropdown[leadExportFilterElements[2].id]}
                onOpenChange={(open) =>
                  setOpenDropdown((prev) => ({
                    ...prev,
                    [leadExportFilterElements[2].id]: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[240px] justify-between",
                      !field.value?.value && "text-muted-foreground"
                    )}
                  >
                    {field.value?.value
                      ? leadExportFilterElements[2].options.find(
                          (o) => o.value === field.value.value
                        )?.label
                      : leadExportFilterElements[2].default
                      ? leadExportFilterElements[2].options.find(
                          (o) => o.value === leadExportFilterElements[2].default
                        )?.label
                      : `Select ${leadExportFilterElements[2].label}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${leadExportFilterElements[2].label.toLowerCase()}...`}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No option found.</CommandEmpty>
                      <CommandGroup>
                        {leadExportFilterElements[2].options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              field.onChange({
                                id: leadExportFilterElements[2].id,
                                type: leadExportFilterElements[2].type,
                                value: option.value,
                              })
                              setOpenDropdown((prev) => ({
                                ...prev,
                                [leadExportFilterElements[2].id]: false,
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
    </div>
  )
}
