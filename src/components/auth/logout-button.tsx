"use client";
import { signOut } from "next-auth/react";
import { useTransition } from "react";
import LoadingButton from "../form/loading-button";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  async function handleLogOut() {
    startTransition(async () => {
      await signOut({
        redirect: true,
        redirectTo: "/login",
      });
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      loadingText="Logging out..."
      onClick={() => handleLogOut()}
    >
      Log out
    </LoadingButton>
  );
}
