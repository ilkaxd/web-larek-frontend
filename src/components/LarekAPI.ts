import { Api, ApiListResponse } from "./base/api";
import { IOrder, IOrderResult, ILot  } from "../types";  

interface ILarekAPI {
  getLotItem: (id: string) => Promise<ILot>;
  getLotList: () => Promise<ILot[]>;
  postOrderLots: (order: IOrder) => Promise<IOrderResult>;
}

class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)
        this.cdn = cdn
    }

    getLotItem(id: string): Promise<ILot>{
        return this.get(`/product/${id}`).then(
            (item: ILot) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotList(): Promise<ILot[]>{
        return this.get('/product/').then(
            (data: ApiListResponse<ILot>) => 
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    postOrderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}

export { LarekAPI }