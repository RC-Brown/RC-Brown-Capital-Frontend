"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      // Store token and user info (customize as needed)
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      // Redirect to dashboard or home
      router.push("/");
    } else {
      router.push("/login?error=google_oauth_failed");
    }
  }, [searchParams, router]);

  return <div>Logging you in with Google...</div>;
}
