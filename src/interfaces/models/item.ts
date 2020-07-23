export default interface IItem {
  id?: number;
  description: string;
  price: number;
  amount?: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface IItems extends Array<IItem> {}
