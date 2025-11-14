"use client";

import React, { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({
  backUrl,
}: PropsWithChildren & { backUrl?: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (backUrl ? router.replace(backUrl) : router.back())}
      aria-label="Back"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
