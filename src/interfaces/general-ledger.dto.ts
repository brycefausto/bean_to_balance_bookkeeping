import { BookAccount, GeneralLedger, LedgerCategory } from "@prisma/client";

export interface GeneralLedgerView extends GeneralLedger {
    bookAccount: BookAccount;
}

export interface CreateGeneralLedgerDto {
    date: Date;
    item?: string;
    postRef?: string;
    debit?: number;
    credit?: number;
    balance?: number;
    bookAccountId: string;
    bookAccount: BookAccount;
    ledgerCategory: LedgerCategory;
}

