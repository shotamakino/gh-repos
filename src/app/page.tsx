"use client";

import useUser from "@/hooks/api/useUser";
import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ReposTable from "@/components/repos-table";
import SearchBox from "@/components/repos-table/SearchBox";

import type { ChangeEvent } from "react";
import FormContextProvider from "@/components/repos-table/filter-form/FormContext";

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-16 mx-auto container">
      <FormContextProvider>
        <div className="flex w-full pb-10 justify-between">
          <h1 className="flex">
            <span className="pr-2">Welcome</span>
            {!isLoading ? (
              <span className="font-bold">{user?.login}</span>
            ) : (
              <Skeleton className={"h-4 w-[200px]"} />
            )}
          </h1>
          <SearchBox />
        </div>
        <ReposTable />
      </FormContextProvider>
    </main>
  );
}
