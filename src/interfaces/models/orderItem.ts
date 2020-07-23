import IItem from 'interfaces/models/item';

export default interface IOrders {
  id?: number;
  orderId: number;
  itemId: number;
  amount: number;
  createdDate?: Date;
  updatedDate?: Date;

  items?: IItem;
}

export interface IOrdersArray extends Array<IOrders> {}
