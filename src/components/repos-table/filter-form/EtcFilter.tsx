import { useFormContext } from "react-hook-form";
import type { FilterFormSchema } from "./FilterForm";
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

export default function LangFilter() {
  const { control, register } = useFormContext<FilterFormSchema>();

  return (
    <div className="w-full flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="language">Language</Label>
        <Input id="language" type="text" {...register(`language` as const)} />
      </div>
      <div className="flex items-center space-x-2">
        <FormField
          control={control}
          name="archived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
              <FormControl>
                <Switch
                  id="archived"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Label htmlFor="archived">Archived</Label>
      </div>
    </div>
  );
}
