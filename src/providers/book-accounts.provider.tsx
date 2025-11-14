"use client";

import {
  BookAccountsContext,
  BookAccountsProps,
  BookAccountsStore,
  createBookAccountsStore,
} from "@/store/book-accounts.store";
import { useRef } from "react";

type BookAccountProviderProps = React.PropsWithChildren<BookAccountsProps>;

export function BookAccountProvider({
  children,
  ...props
}: BookAccountProviderProps) {
  const storeRef = useRef<BookAccountsStore>(null);
  if (!storeRef.current) {
    storeRef.current = createBookAccountsStore(props);
  }

  return (
    <BookAccountsContext.Provider value={storeRef.current}>
      {children}
    </BookAccountsContext.Provider>
  );
}
