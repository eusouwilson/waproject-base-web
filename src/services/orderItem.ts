import IOrders, { IOrdersArray } from 'interfaces/models/orderItem';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class OrderItemService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrders>> {
    return this.apiService.get('app/orders', params);
  }

  public current(id: number): Observable<IOrdersArray> {
    return this.apiService.get(`app/orders/${id}`);
  }

  public save(model: Partial<IOrders>): Observable<IOrders> {
    return this.apiService.post('app/orders', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`app/orders/${id}`);
  }
}

const orderItemService = new OrderItemService(apiService);
export default orderItemService;
