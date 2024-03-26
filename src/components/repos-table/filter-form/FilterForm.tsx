"use client";

import { useEffect, useCallback } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import TextFilter from "./TextFilter";
import LangFilter from "./EtcFilter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useFilterForm } from "./FormContext";

const formSchema = z.object({
  name: z.string(),
  textIn: z
    .object({
      text: z.string(),
      in: z.enum(["name", "description", "topics", "readme"]),
    })
    .optional(),
  language: z.string().optional(),
  archived: z.boolean().optional(),
});

export type FilterFormSchema = z.infer<typeof formSchema>;

interface FilterFormProps {
  defaultName: string;
  onSubmit: (data: FilterFormSchema) => void;
}

export default function FilterForm({
  defaultName,
  onSubmit: handleSubmit,
}: FilterFormProps) {
  const { filters } = useFilterForm();
  const methods = useForm<FilterFormSchema>({
    resolver: zodResolver(formSchema),
    values: { name: defaultName },
    defaultValues: {
      textIn: {
        text: filters?.textIn?.text,
        in: filters?.textIn?.in,
      },
      language: filters?.language,
      archived: filters?.archived,
    },
  });
  const onSubmit: SubmitHandler<FilterFormSchema> = useCallback(
    (data) => {
      handleSubmit(data);
    },
    [handleSubmit]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "enter") {
        e.preventDefault();
        methods.handleSubmit(onSubmit);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onSubmit, methods]);

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex items-center" cmdk-input-wrapper="">
              <MagnifyingGlassIcon className="mr-2 h-6 w-6 shrink-0 opacity-50" />
              <Input
                {...methods.register("name")}
                placeholder="Type a user or org name..."
                className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <DialogPrimitive.Close className="outline-none rounded-sm opacity-50 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Cross2Icon className="h-6 w-6 ml-2" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
            <div className="flex-auto px-8 items-center space-y-4">
              <TextFilter />
              <LangFilter />
              <Button
                className="h-8 mt-2 text-xs outline-none text-center justify-center"
                type="submit"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
