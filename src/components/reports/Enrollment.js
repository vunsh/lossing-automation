import { useState, useEffect } from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export const enrollmentFilterElements = [
  {
    id: "EnrollmentStatusDropDown",
    label: "Enrollment Status",
    type: "dropdown",
    options: [
      { label: "Enrolled", value: "Enrolled" },
      { label: "On Hold", value: "On Hold" },
      { label: "Inactive", value: "Inactive" },
      { label: "Pre-Enrolled", value: "Pre-Enrolled" },
    ],
    default: "Enrolled",
  },
  {
    id: "DeliveryOptionsFilter",
    label: "Delivery Method",
    type: "dropdown",
    options: [
      { label: "All", value: "All" },
      { label: "In-Center", value: "In-Center" },
      { label: "@home", value: "@home" },
    ],
    default: "All",
  },
]

export function getEnrollmentDefaults() {
  const defaults = {}
  for (const el of enrollmentFilterElements) {
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

export default function EnrollmentFilters({ control }) {
  const [openDropdown, setOpenDropdown] = useState({})

  useEffect(() => {
    const setValue = control._formContext?.setValue
    if (!setValue) return
    enrollmentFilterElements.forEach((el) => {
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
        {enrollmentFilterElements.map((el) => (
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
