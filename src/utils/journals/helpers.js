export function verifyEntryData(data = { debit: 0, credit: 0, entryId: "" }) {
  const { credit, debit, entryId } = data;

  if (debit > 0 && credit > 0) {
    throw new Error(`Entry data with id ${entryId} is not valid!`);
  }
}

export function verifyAccountId(accountId = "", entryAccountId = "") {
  if (accountId !== entryAccountId) {
    throw new Error(
      `All entries to for changing journal account must be of one account. Received entry accountId ${entryAccountId} instead of ${accountId}!`
    );
  }
}
