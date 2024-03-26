"use client";

import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { DialogOverlay, Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFilterForm } from "./filter-form/FormContext";

import FilterForm, { FilterFormSchema } from "./filter-form/FilterForm";

export default function NameInput() {
  const { filters, setFilters } = useFilterForm();

  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const handleClose = useCallback(
    (data: FilterFormSchema) => {
      setFilters?.(data);
      setOpen(false);
    },
    [setOpen, setFilters]
  );

  return (
    <div className="flex w-full justify-end relative">
      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogOverlay className="bg-[rgba(140,149,159,0.2)]" />
        <div className="absolute flex w-full">
          <div className="relative flex w-full">
            <div className="absolute z-50 -top-4 w-full" ref={setContainer} />
          </div>
        </div>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="flex flex-auto max-w-sm min-w-xs h-9 w-full rounded-md border border-input justify-between bg-white hover:bg-white text-slate-700 font-light px-3 py-1 text-sm shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
            <span>{filters?.name}</span>
          </Button>
        </DialogTrigger>

        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Content
            className={
              "grid w-full bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95  sm:rounded-lg"
            }
          >
            <FilterForm
              onSubmit={handleClose}
              defaultName={filters?.name ?? ""}
            />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </div>
  );
}
