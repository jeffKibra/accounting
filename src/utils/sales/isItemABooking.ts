import { ItemType } from 'types';

export default function isItemABooking(itemType: ItemType) {
  return itemType === 'vehicle'; //append other or options if need be
}
