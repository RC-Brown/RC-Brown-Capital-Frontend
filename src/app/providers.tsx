"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import ScrollToTop from "@/src/components/scroll-to-top";
// import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* <NuqsAdapter> */}
      <SessionProvider>{children}</SessionProvider>
      {/* </NuqsAdapter> */}
      <ScrollToTop />
      <ReactQueryDevtools buttonPosition='bottom-right' />
    </QueryClientProvider>
  );
}
