import { Entry } from "../../types";

export function verifyEntryData(data: Entry) {
  const { credit, debit, entryId } = data;

  if (debit > 0 && credit > 0) {
    throw new Error(`Entry data with id ${entryId} is not valid!`);
  }
}

export function verifyAccountId(accountId: string, entryAccountId: string) {
  if (accountId !== entryAccountId) {
    throw new Error(
      `All entries to for changing journal account must be of one account. Received entry accountId ${entryAccountId} instead of ${accountId}!`
    );
  }
}
