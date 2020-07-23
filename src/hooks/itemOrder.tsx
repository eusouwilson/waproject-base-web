import React, { useContext, useState, createContext } from 'react';
import IItem, { IItems } from 'interfaces/models/item';
import orderItemService from 'services/orderItem';

//import IOrder from 'interfaces/models/order';

interface IItemOrderContextData {
  itemData: IItems;
  addItem(item: IItems): void;
  carLength: number;
  removeItem(item: IItem): void;
  handleSaveOrder(orderId: number): void;
  opened: boolean;
  openedCart(): void;
  load: boolean;
}

const itemOrderContext = createContext<IItemOrderContextData>({} as IItemOrderContextData);

export const ItemOrderDataProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line
  const [itemData, setItemData] = useState<IItems>([]);
  const [load, setLoad] = useState(false);
  const [carLength, setCarLength] = useState(0);
  const [opened, setOpened] = useState(false);

  function addItem(item: IItems) {
    setCarLength(carLength + 1);

    setItemData(item);
  }

  function openedCart() {
    setOpened(!opened);
  }

  function removeItem(item: Partial<IItem>) {
    setCarLength(carLength - 1);
    let temp = itemData.filter(i => i.id !== item.id);
    setItemData(temp);
  }

  function handleSaveOrder(orderId: number) {
    setLoad(true);
    itemData.map(i => {
      let itemId = i.id;
      let amount = i.amount;
      console.log({ itemId, amount, orderId });
      return orderItemService.save({ itemId, amount, orderId });
    });
    setLoad(false);
  }

  return (
    <itemOrderContext.Provider
      value={{
        itemData,
        addItem,
        removeItem,
        carLength,
        handleSaveOrder,
        opened,
        openedCart,
        load
      }}
    >
      {children}
    </itemOrderContext.Provider>
  );
};

export function useItemOrderData() {
  const context = useContext(itemOrderContext);
  return context;
}
