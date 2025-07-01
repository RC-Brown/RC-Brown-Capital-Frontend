"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error</h1>
      <Button onClick={() => router.push("/")}>Go to Home</Button>
    </div>
  );
}
