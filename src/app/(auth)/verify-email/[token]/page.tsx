import { validateToken } from "@/actions/validate-token";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageParams } from "@/types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { verifyEmailAction } from "@/actions/email-verification";
import { getUserSession } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({ params }: PageParams<{ token: string }>) {
  const { token } = await params;
  const user = await getUserSession();
  const isTokenValid = !!(await validateToken(token));

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user && isTokenValid) {
    await verifyEmailAction(token);
  }

  if (!token || !isTokenValid) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
            <CardDescription>Invalid or expired reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border border-red-500" variant="destructive">
              <AlertDescription>
                The link is invalid or has expired. Please request a new one.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4"
              >
                Back to forgot password
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Verified</CardTitle>
          <CardDescription>Your email has been verified</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" text-gray-600">
            Thanks — your email{" "}
            <span className="font-medium text-gray-800">{user.email}</span> has
            been successfully verified.
          </p>

          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/account">Manage account</Link>
            </Button>
          </div>

          <div className="mt-6 w-full">
            <Alert className="bg-green-50 p-3 text-sm text-green-800 border border-green-100">
              <AlertTitle>All set!</AlertTitle>
              <AlertDescription>
                You can now sign in and start using your account. If you didn't
                expect this verification, please{" "}
                <span>
                  <a href="/contact" className="underline">
                    contact support
                  </a>
                  .
                </span>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
