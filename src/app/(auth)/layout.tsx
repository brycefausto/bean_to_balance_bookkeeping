import HomeLayout from "@/components/home/home-layout";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeLayout>
      <div className="flex min-h-svh w-full top-50 justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </HomeLayout>
  );
}
