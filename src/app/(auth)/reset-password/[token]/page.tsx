import { validateToken } from "@/actions/validate-token";
import { PageParams } from "@/types";
import { ResetPasswordForm } from "./reset-password-form";

export default async function Page({ params }: PageParams<{ token: string }>) {
  const { token } = await params;
  const isTokenValid = !!(await validateToken(token));
  return <ResetPasswordForm token={token} isTokenValid={isTokenValid} />;
}
