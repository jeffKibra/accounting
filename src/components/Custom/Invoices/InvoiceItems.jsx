import { useState, useMemo, useContext } from "react";
import { VStack, Flex, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

import useToasts from "../../../hooks/useToasts";

import { FormContext } from "../../../contexts/stepperFormContext";

import AddItem from "../../../components/Custom/Invoices/AddItem";
import AddedItemsTable from "../../../components/tables/Invoices/AddedItemsTable";
import Summary from "../../../components/Custom/Invoices/Summary";

function InvoiceItems(props) {
  const { loading, items } = props;
  const formContext = useContext(FormContext);
  const { state, next } = formContext;

  const [selectedItems, setSelectedItems] = useState(state.selectedItems || []);
  const [shipping, setShipping] = useState(state.summary?.shipping || 0);
  const [adjustment, setAdjustment] = useState(state.summary?.adjustment || 0);
  console.log({ selectedItems, shipping, adjustment });

  const summary = useMemo(() => {
    let taxes = [];
    selectedItems.forEach((item) => {
      const index = taxes.findIndex((tax) => tax.taxId === item.tax?.taxId);

      if (index === -1) {
        taxes.push(item.tax);
      }
    });
    console.log({ taxes });

    taxes = taxes
      .filter((tax) => tax?.name)
      .map((tax) => {
        const { taxId, rate } = tax;
        console.log({ rate });
        //get all items with this tax
        const totalAmount = selectedItems
          .filter((obj) => obj.tax.taxId === taxId)
          .reduce((prev, current) => {
            const { amount } = current;
            return amount + prev;
          }, 0);

        const taxedAmount = Math.ceil((totalAmount * rate) / 100);

        console.log({ taxedAmount });
        console.log({ tax });

        return { ...tax, taxedAmount };
      });

    const totalTax = taxes.reduce((prev, current) => {
      const { taxedAmount } = current;
      return prev + taxedAmount;
    }, 0);

    const subTotal = selectedItems.reduce((prev, current) => {
      const { amount } = current;
      return prev + amount;
    }, 0);

    const totalAmount = subTotal + totalTax + adjustment + shipping;

    return {
      taxes,
      subTotal,
      totalTax,
      adjustment,
      shipping,
      totalAmount,
      balance: totalAmount,
    };
  }, [selectedItems, adjustment, shipping]);

  function addItem(data) {
    console.log({ data });
    const { itemId, rate, quantity, discount, discountType } = data;
    const item = items.find((item) => item.itemId === itemId);
    let amount = rate * quantity;
    let totalDiscount = 0;

    if (discount > 0) {
      if (discountType === "KES") {
        totalDiscount = discount;
      } else {
        totalDiscount = Math.floor((discount * amount) / 100);
      }
    }

    console.log({ amount, totalDiscount });

    amount = amount - totalDiscount;

    const itemData = {
      itemId,
      rate,
      quantity,
      discount,
      discountType,
      totalDiscount,
      amount,
    };

    setSelectedItems((current) => {
      const index = current.findIndex((value) => value.itemId === itemId);
      console.log({ current, index, quantity });
      let newItems = [];

      if (index === -1) {
        //value not in selected array
        newItems = [...current, { ...item, ...itemData }];
      } else {
        //value is in the selected array
        newItems = current.map((value, i) => {
          if (i === index) {
            return {
              ...value,
              ...itemData,
            };
          } else {
            return value;
          }
        });
      }

      return newItems;
    });
  }

  function handleDelete(itemId) {
    console.log({ itemId });
    setSelectedItems((current) => {
      return current.filter((item) => item.itemId !== itemId);
    });
  }

  const toasts = useToasts();

  function save() {
    console.log({ selectedItems });
    if (selectedItems.length === 0) {
      return toasts.error("You must add atleast one item to an Invoice!");
    }

    const all = {
      selectedItems,
      summary,
    };

    next(all);
  }

  console.log({ selectedItems });

  return (
    <VStack mt="0px !important" maxW="full" h="full">
      <AddItem loading={loading} addItem={addItem} items={items || []} />

      <AddedItemsTable
        handleEdit={addItem}
        handleDelete={handleDelete}
        items={selectedItems}
      />

      <Summary
        loading={loading}
        summary={summary}
        adjustment={adjustment}
        setAdjustment={setAdjustment}
        shipping={shipping}
        setShipping={setShipping}
      />
      <Flex mt={4}>
        <Button mt={4} colorScheme="cyan" onClick={save}>
          next
        </Button>
      </Flex>
    </VStack>
  );
}

InvoiceItems.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
};

export default InvoiceItems;
