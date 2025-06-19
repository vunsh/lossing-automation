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

// Helper to get one year before today
function getOneYearAgo() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return d
}

export const assessmentFilterElements = [
  {
    id: "ReportStart",
    label: "Start Date",
    type: "date",
    default: getOneYearAgo(),
  },
  {
    id: "ReportEnd  ",
    label: "End Date",
    type: "date",
    default: null,
  },
  {
    id: "prePostDropDownList",
    label: "Pre/Post",
    type: "dropdown",
    options: [
      { label: "All", value: "All" },
      { label: "Pre", value: "Pre" },
      { label: "Post", value: "Post" },
    ],
    default: "All",
  },
  {
    id: "DeliveryOptionsFilter",
    label: "Delivery",
    type: "dropdown",
    options: [
      { label: "All", value: "All" },
      { label: "In-Center", value: "In-Center" },
      { label: "@home", value: "@home" },
      { label: "Hybrid", value: "Hybrid" },
    ],
    default: "All",
  },
]

// Helper to get default values for useForm
export function getAssessmentDefaults() {
  const defaults = {}
  for (const el of assessmentFilterElements) {
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

export default function Assessment({ control }) {
  const [openDropdown, setOpenDropdown] = useState({})

  useEffect(() => {
    const setValue = control?._formContext?.setValue
    if (!setValue) return
    assessmentFilterElements.forEach((el) => {
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
\      <div className="flex gap-4">
        {assessmentFilterElements.slice(0, 2).map((el) => (
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
        {assessmentFilterElements.slice(2, 4).map((el) => (
          <FormField
            key={el.id}
            name={el.id}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-cyan-200">{el.label}</FormLabel>
                <FormControl>
                  <Popover
                    open={!!openDropdown[el.id]}
                    onOpenChange={(open) =>
                      setOpenDropdown((prev) => ({ ...prev, [el.id]: open }))
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
                          ? el.options.find(
                              (o) => o.value === field.value.value
                            )?.label
                          : el.default
                          ? el.options.find(
                              (o) => o.value === el.default
                            )?.label
                          : `Select ${el.label}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput
                          placeholder={`Search ${el.label.toLowerCase()}...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No option found.</CommandEmpty>
                          <CommandGroup>
                            {el.options.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={() => {
                                  field.onChange({
                                    id: el.id,
                                    type: el.type,
                                    value: option.value,
                                  })
                                  setOpenDropdown((prev) => ({
                                    ...prev,
                                    [el.id]: false,
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
        ))}
      </div>
    </div>
  )
}
