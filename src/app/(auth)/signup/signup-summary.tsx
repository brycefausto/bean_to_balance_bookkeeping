import { registerAction } from "@/actions/register";
import ErrorAlert from "@/components/alert/error-alert";
import LoadingButton from "@/components/form/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFormStore } from "./store";

export default function SignUpSummary() {
  const { registerData, companyData, prevStep } = useFormStore();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      try {
        const result = await registerAction(registerData, companyData);

        if (result.data) {
          const res = await signIn("credentials", {
            email: registerData.email,
            password: registerData.password,
            redirect: false,
          });

          if (!res.error) {
            router.push("/dashboard");
          } else {
            throw new Error(res.code);
          }
        } else {
          throw Error(result.message);
        }

        if (!result.data) {
          throw Error(result.message);
        }
      } catch (error: any) {
        setError(error.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ErrorAlert message={error} setMessage={setError} />
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Name: {registerData.name}</div>
          <div>Email: {registerData.email}</div>
          <div>
            Phone:{" "}
            {registerData.phone || (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
          <div>
            Address:{" "}
            {registerData.address || (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Name: {companyData.name}</div>
          <div>Email: {companyData.email}</div>
          <div>Phone: {companyData.phone}</div>
          <div>Address: {companyData.address}</div>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-4">
        <Button
          className="flex-1"
          type="button"
          variant="secondary"
          onClick={prevStep}
        >
          Back
        </Button>
        <LoadingButton
          className="flex-1"
          loading={isPending}
          onClick={onSubmit}
        >
          Sign Up
        </LoadingButton>
      </div>
    </div>
  );
}
