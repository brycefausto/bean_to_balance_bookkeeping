import { requestEmailVerificationAction } from "@/actions/email-verification";
import LoadingButton from "@/components/form/loading-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@prisma/client";
import { AlertCircleIcon } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function EmailVerificationButton({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  async function sendEmailVerification() {
    startTransition(async () => {
      try {
        const result = await requestEmailVerificationAction(user.email);
        if (result.success) {
          toast.success(
            result.message || "If an account exists, we sent an email"
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  }

  if (!user.emailVerified) {
    return (
      <Alert className="mb-4 border border-yellow-500" variant="default">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          <p>Your email is not verified yet.</p>
          <LoadingButton
            type="button"
            loading={isPending}
            loadingText="Sending email verification..."
            onClick={() => sendEmailVerification()}
          >
            Send email verification
          </LoadingButton>
        </AlertDescription>
      </Alert>
    );
  }

  return;
}
