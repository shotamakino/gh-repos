"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterFormSchema } from "./FilterForm";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { useCallback, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

export type AvailableFields = Exclude<
  FilterFormSchema["textIn"],
  undefined
>["in"];

export default function TextFilter() {
  const { control, register } = useFormContext<FilterFormSchema>();

  const allFields: AvailableFields[] = [
    "name",
    "description",
    "topics",
    "readme",
  ];

  return (
    <>
      <label className="text-xs opacity-70">
        Filter by text (joined by a logical &apos;or&apos;)
      </label>
      <div className="w-full flex items-center space-x-2">
        <Input className="h-8 py-3" {...register(`textIn.text` as const)} />
        <span>in</span>
        <FormField
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px] h-8 py-3">
                    <SelectValue placeholder="in..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {allFields.map((f) => (
                      <SelectItem value={f} key={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
          control={control}
          name={`textIn.in`}
          defaultValue="name"
        />
      </div>
    </>
  );
}
