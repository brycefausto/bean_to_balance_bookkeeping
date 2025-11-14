"use client";

import { parseParamsFromURLParams } from "@/lib/paramUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useCallback, useState } from "react";

export default function usePageUtils() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { page, search } = parseParamsFromURLParams(searchParams);
  const [searchValue, setSearchValue] = useState(search || "");

  const changePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);

      if (newPage > 1) {
        params.set("page", newPage.toString());
      } else {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const changeParam = useCallback(
    (paramName: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const changeSearch = useCallback(
    (newSearch: string) => changeParam("search", newSearch),
    [searchParams, router, pathname]
  );

  const handleSearchClick = () => {
    changeSearch(searchValue.trim());
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeSearch(searchValue.trim());
    }
  };

  return {
    router,
    pathname,
    page,
    searchValue,
    changePage,
    changeSearch,
    changeParam,
    handleSearchChange,
    handleSearchClick,
    handleSearchEnter,
  };
}
