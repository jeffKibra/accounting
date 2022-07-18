import { Entry, GroupedEntries } from "../../types";

export default function groupEntriesBasedOnAccounts(entries: Entry[]) {
  return entries.reduce<GroupedEntries>((groupedEntries, entry) => {
    console.log({ groupedEntries });
    const {
      account: { accountId },
    } = entry;

    const group = groupedEntries[accountId];

    return {
      ...groupedEntries,
      [accountId]: group ? [...group, entry] : [entry],
    };
  }, {});
}
