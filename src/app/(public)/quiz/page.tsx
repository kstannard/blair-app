"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/discover");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blair-linen">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
    </div>
  );
}
