"use client";

import useUser from "@/hooks/api/useUser";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import ReposTable from "@/components/repos-table/reposTable";

export default function Home() {
  const { user, isLoading } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 pt-16 mx-auto container">
      <div className="flex w-full pb-10">
        {!isLoading ? (
          <h1>
            Welcome <span className="font-bold">{user?.login}</span>
          </h1>
        ) : (
          <Skeleton className={"h-4 w-[200px]"} />
        )}
      </div>
      <ReposTable />
    </main>
  );
}
