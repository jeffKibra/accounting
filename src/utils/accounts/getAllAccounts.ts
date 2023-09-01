import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase';

import { Account, AccountType } from '../../types';

export default async function getAllAccounts(orgId: string) {
  const accountsDoc = await getDoc(
    doc(db, 'organizations', orgId, 'orgDetails', 'accounts')
  );
  if (!accountsDoc.exists) {
    throw new Error(
      'Something went wrong with accounts! If the error persists, contact support for help!'
    );
  }
  const accountsData = accountsDoc.data() as Record<
    string,
    { name: string; accountType: AccountType }
  >;

  const accounts: Account[] = Object.keys(accountsData).map(key => {
    return {
      accountId: key,
      ...accountsData[key],
    };
  });

  return accounts;
}
