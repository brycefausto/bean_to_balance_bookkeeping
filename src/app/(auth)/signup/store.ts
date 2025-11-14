import { RegisterData } from "@/schemas/auth";
import { CreateCompanyData } from "@/schemas/company";
import { create } from "zustand";
interface FormProps {
  currentStep: number;
  companyData: CreateCompanyData;
  registerData: RegisterData;
}

interface FormStore extends FormProps {
  setCurrentStep: (step: number) => void;
  setCompanyData: (data: CreateCompanyData) => void;
  setUserData: (data: RegisterData) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const EMPTY_COMPANY: CreateCompanyData = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const EMPTY_USER: RegisterData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const DEFAULT_FORM_VALUES = {
  currentStep: 1,
  companyData: EMPTY_COMPANY,
  registerData: EMPTY_USER,
};

export const useFormStore = create<FormStore>((set) => ({
  ...DEFAULT_FORM_VALUES,
  setCurrentStep: (step) => set({ currentStep: step }),
  setCompanyData: (data) =>
    set((state) => ({
      companyData: { ...state.companyData, ...data },
    })),
  setUserData: (data) =>
    set((state) => ({
      registerData: { ...state.registerData, ...data },
    })),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  reset: () => set(DEFAULT_FORM_VALUES),
}));
