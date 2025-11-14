import { BookAccount } from "@prisma/client";
import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

export interface BookAccountsProps {
  bookAccounts: BookAccount[];
}

export interface BookAccountsState extends BookAccountsProps {
  addAccount: (account: BookAccount) => void;
  updateAccount: (code: string, account: BookAccount) => void;
  deleteAccount: (code: string) => void;
}

export const createBookAccountsStore = (initProps?: Partial<BookAccountsProps>) => {
  const DEFAULT_PROPS: BookAccountsProps = {
    bookAccounts: [],
  };
  return createStore<BookAccountsState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setAccounts: (bookAccounts: BookAccount[]) =>
      set((_) => ({
        bookAccounts: [...bookAccounts],
      })),
    addAccount: (bookAccount) =>
      set((state) => ({
        bookAccounts: [...state.bookAccounts, bookAccount],
      })),
    updateAccount: (code, bookAccount) =>
      set((state) => ({
        bookAccounts: state.bookAccounts.map((a) =>
          a.code === code ? { ...a, ...bookAccount } : a
        ),
      })),
    deleteAccount: (code) =>
      set((state) => ({
        bookAccounts: state.bookAccounts.filter((a) => a.code !== code),
      })),
  }));
};

export type BookAccountsStore = ReturnType<typeof createBookAccountsStore>

export const BookAccountsContext = createContext<BookAccountsStore | null>(null)

export function useBookAccountsContext() {
  const store = useContext(BookAccountsContext)
  if (!store) throw new Error("Missing BookAccountsContext.Provider in the tree")
  return useStore(store, state => state)
}

/**
 * export interface UserProps {
  user: AppUser
  loggedIn: boolean
}

export interface UserState extends UserProps {
  setUser: (user: AppUser) => void
  clearUser: () => void
}

export const createUserStore = (initProps?: Partial<UserProps>) => {
  const DEFAULT_PROPS: UserProps = {
    user: {
      id: "",
      name: "",
      email: "",
      role: UserRole.ADMIN,
      createdAt: "",
      updatedAt: ""
    },
    loggedIn: false
  }
  return createStore<UserState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setUser: (user) => set(() => ({ user, loggedIn: true })),
    clearUser: () => set(() => (DEFAULT_PROPS)),
  }))
}

export type UserStore = ReturnType<typeof createUserStore>

export const UserContext = createContext<UserStore | null>(null)

export function useUserContext() {
  const store = useContext(UserContext)
  if (!store) throw new Error("Missing UserContext.Provider in the tree")
  return useStore(store, state => state)
}

 */
