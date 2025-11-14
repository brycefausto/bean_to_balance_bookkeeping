import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  const company = session.user?.company || { id: "", name: "" };

  return { user: session.user, company };
}
