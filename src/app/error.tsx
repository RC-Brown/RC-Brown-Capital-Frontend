"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>Error</h1>
      <Button onClick={() => router.refresh()}>Refresh</Button>
    </div>
  );
}
