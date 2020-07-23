import IItem from 'interfaces/models/item';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class ItemService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IItem>> {
    return this.apiService.get('app/item', params);
  }

  public current(): Observable<IItem> {
    return this.apiService.get('app/item/current');
  }

  public save(model: Partial<IItem>): Observable<IItem> {
    return this.apiService.post('app/item', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`app/item/${id}`);
  }
}

const itemService = new ItemService(apiService);
export default itemService;
