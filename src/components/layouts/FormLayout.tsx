"use client";

import React, { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormLayout({
  children,
  backUrl,
}: PropsWithChildren & { backUrl?: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col p-4">
      <div className="w-full max-w-4xl flex items-center mb-4 sticky top-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => (backUrl ? router.replace(backUrl) : router.back())}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="w-full">
        <div className="flex justify-center items-center">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
