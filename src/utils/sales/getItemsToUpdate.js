// import { SalesItem, SalesItemFromForm } from "../../types";

export default function getItemsToUpdate(items = [], incomingItems = []) {
  /**
   * traverse through items array
   * check if current item is in the incoming items array
   * if true, compute adjustment value and remove item from incoming items array
   * else value has been deleted, compute adjustment
   * check if there are any values left in the incomingItems array
   * traverse over the remaining value-all are new items
   * compute adjustment values
   *
   * remove all similar values--adjustment value is zero(0)
   * finally compute adjustment values for specific sales accounts
   *
   */

  //new array to hold all the different values
  //no duplicates
  let uniqueItems = [];

  /**
   * are the items similar.
   * traverse items and remove similar items from both arrays
   * if the remaining arrays are empty, items were similar,
   * else, the items have changed
   */
  const items1 = [...items];
  const items2 = [...incomingItems];
  const similarItems = [];
  /**
   * for similar items, don't alter taxExclusiveAmount
   * give tag="similar"
   * for new items, dont alter taxExclusiveAmount - only available in items2 array
   * give a tag="new"
   * for deleted items, assign taxExclusiveAmount=0-Only available in items1 array
   * give tag="deleted"
   */

  items1.forEach((item, i) => {
    const { itemId, taxExclusiveAmount } = item;
    const index = items2.findIndex((item2) => item2.itemId === itemId);
    let data = item;

    if (index > -1) {
      /**
       * similar item has been found
       * use splice function to remove item from items2 array.
       * the return value is an array containing the removed items.
       * assign the returned value to be item2 at index 0
       */
      const item2 = items2.splice(index, 1)[0];
      /**
       * remove salesAccount and salesAccountId from item2
       * currently, there is no support for a situation where the items sales
       * Account has changed.
       * always use the items first sales account
       * then spread data from item2 to overide since its the latest data
       */
      const { salesAccountId, salesAccount, ...rest } = item2;
      //assign values to data
      data = {
        ...data,
        ...rest,
      };
      //check if both item taxExclusive amounts are equal
      if (taxExclusiveAmount === item2.taxExclusiveAmount) {
        //push to similarItems array
        similarItems.push({
          ...data,
        });
      }
    } else {
      /**
       * still traversing items1 array.
       * if item has not been found in second array
       * it has been deleted
       * set taxExclusiveAmount and totalAmount to be zero
       * subtract from zero to make it -ve
       */
      data = {
        ...data,
        taxExclusiveAmount: 0,
        totalAmount: 0,
      };
    }
    /**
     * at the end of a cycle
     * add the newly created data to the unique items array
     */
    uniqueItems.push(data);
  });

  /**
   * check if there are items remaining in items2 array
   * this is a completely new item
   * values are new. add them to unique items array
   */
  if (items2.length > 0) {
    items2.forEach((item) => {
      uniqueItems.push(item);
    });
  }

  return { uniqueItems, similarItems };
}
