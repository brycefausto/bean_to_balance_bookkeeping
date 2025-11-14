"use client";
import { SignupForm } from "@/app/(auth)/signup/signup-form";
import { CompanyForm } from "./company-form";
import { StepIndicator } from "./step-indicator";
import { useFormStore } from "./store";
import SignUpSummary from "./signup-summary";

export default function Page() {
  const { currentStep } = useFormStore();

  return (
    <div className="max-w-4xl min-w-xl mx-auto px-8">
      <StepIndicator />

      <div className="mt-8">
        {currentStep === 1 && <SignupForm />}
        {currentStep === 2 && <CompanyForm />}
        {currentStep === 3 && <SignUpSummary />}
      </div>
    </div>
  );
}
