import { increment, FieldValue } from 'firebase/firestore';

interface AggregationData {
  [key: string]: number | FieldValue;
}

export default class SummaryData {
  data: AggregationData;

  constructor() {
    this.data = {};
  }

  append(fieldName: string, incomingValue: number, currentValue?: number) {
    const prevValue = currentValue || 0;
    const adjustment = incomingValue - prevValue;

    this.data = {
      ...this.data,
      [fieldName]: increment(adjustment),
    };
  }

  appendObject(obj: { [key: string]: number | FieldValue }) {
    const { data } = this;
    if (data && typeof data === 'object') {
      this.data = { ...data, ...obj };
    } else {
      this.data = obj;
    }
  }

  appendPaymentMode(
    modeId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    this.append(`paymentModes.${modeId}`, incomingValue, currentValue);
  }

  appendAccount(
    accountId: string,
    incomingValue: number,
    currentValue?: number
  ) {
    this.append(`accounts.${accountId}`, incomingValue, currentValue);
  }
}
