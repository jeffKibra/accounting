// import { doc } from "firebase/firestore";
// import { db } from "./firebase";

/**
 *
 * @param {""} accountId
 * @param {[]} accounts
 * @returns {{name:"",accountId:"",accountType:{},}}
 */
export function getAccountData(accountId = "", accounts = []) {
  const found = accounts.find((account) => account.accountId === accountId);

  if (!found) {
    throw new Error(`Account data with id ${accountId} not found!`);
  }
  const { accountType, name } = found;
  return {
    name,
    accountId,
    accountType,
  };
}
