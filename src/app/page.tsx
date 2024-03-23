'use client'

import useUser from "@/hooks/api/useUser";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user, isLoading } = useUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoading ? <h1>Welcome {user.login}</h1> : <Skeleton className={'h-4 w-[200px]'} />}
    </main>
  );
}
