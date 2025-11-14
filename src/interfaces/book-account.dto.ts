import { AccountType, NormalSide } from "@prisma/client";
import _ from "lodash";

export interface CreateBookAccountDto {
  code: string;
  name: string;
  description: string;
  accountType: AccountType;
  financialReport: string;
  normalSide: NormalSide;
}

export interface UpdateBookAccountDto {
  code: string;
  name: string;
  description: string;
  accountType: AccountType;
  financialReport: string;
  normalSide: NormalSide;
}

export function getAccountType(accountType: string) {
  switch (accountType.toUpperCase()) {
    case "ASSET":
    case "CONTRA-ASSET":
      return AccountType.ASSET;
    case "LIABILITY":
      return AccountType.LIABILITY;
    case "EQUITY":
    case "CONTRA-EQUITY":
      return AccountType.EQUITY;
    case "REVENUE":
    case "CONTRA-REVENUE":
      return AccountType.REVENUE;
    case "EXPENSE":
    case "CONTRA-EXPENSE":
      return AccountType.EXPENSE;
    default:
      return AccountType.ASSET;
  }
}

export function getNormalSide(accountType: string) {
  switch (accountType.toUpperCase()) {
    case "ASSET":
    case "CONTRA-EQUITY":
    case "CONTRA-REVENUE":
    case "EXPENSE":
      return NormalSide.DEBIT;
    case "CONTRA-ASSET":
    case "LIABILITY":
    case "EQUITY":
    case "REVENUE":
    case "CONTRA-EXPENSE":
      return NormalSide.CREDIT;
    default:
      return NormalSide.ANY;
  }
}

export const normalSideLabels = {
  [NormalSide.DEBIT]: "Debit",
  [NormalSide.CREDIT]: "Credit",
  [NormalSide.ANY]: "Debit/Credit",
};

export const accountTypeOptions = Object.values(AccountType).map((value) => ({
  label: _.capitalize(value),
  value: value,
}));
