"use client";

import { Check, CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Column } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { CustomerType } from "@/lib/customer/CustomerType";

interface CustomerFilterProps<TValue> {
  column?: Column<CustomerType, TValue>;
  resetSignal: number;
  data: CustomerType[];
  fieldKey: keyof CustomerType;
  title: string;
  placeholder?: string;
}

export function CustomerFilter<TValue>({
  column,
  resetSignal,
  data,
  fieldKey,
  title,
  placeholder = `Search ${title.toLowerCase()}...`,
}: CustomerFilterProps<TValue>) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const uniqueValues = Array.from(
    new Set(
      data
        .map((item) => String(item[fieldKey]))
        .filter((v) => v && v !== "undefined" && v !== "null")
    )
  )
    .sort()
    .filter((v) => v.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    if (selectedValues.length > 0) {
      column?.setFilterValue(selectedValues);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [selectedValues, column]);

  useEffect(() => {
    setSelectedValues([]);
  }, [resetSignal]);

  const handleToggle = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedValues([]);
    column?.setFilterValue(undefined);
    setOpen(false);
  };

  const selectAll = () => {
    setSelectedValues(uniqueValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return `Filter by ${title.toLowerCase()}`;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} ${title.toLowerCase()}s selected`;
  };

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 w-auto border-dashed justify-start text-left min-w-[120px]",
              selectedValues.length === 0 && "text-muted-foreground"
            )}
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            <span className="truncate">{getDisplayText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={selectAll}>
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.length === uniqueValues.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Select All</span>
                  </div>
                </CommandItem>

                {uniqueValues.map((value) => (
                  <CommandItem key={value} onSelect={() => handleToggle(value)}>
                    <div className="flex items-center space-x-2 w-full">
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValues.includes(value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="flex-1 truncate capitalize">
                        {value}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {
                          data.filter(
                            (item) => String(item[fieldKey]) === value
                          ).length
                        }
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={clearFilters}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
