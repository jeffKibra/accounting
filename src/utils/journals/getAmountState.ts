/**
 *
 * @param {*} amount
 * @returns {"positive"||"negative"||"zero"}
 */
export default function getAmountState(amount: number) {
  /**
   * functions returns a string to represent the amount value
   * for easier querying of data
   */
  return amount === 0 ? "zero" : amount > 0 ? "positive" : "negative";
}
