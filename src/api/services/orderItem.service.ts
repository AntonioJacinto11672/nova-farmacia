import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class OrderItemService {

    api = new ApiService();
    authService = new AuthService();

    async createOrderItem(quantity: number, medicineId: string, orderId: string): Promise<ApiResponse<CreateResponse>> {
        const createOrderItemRequest: CreateOrderItemRequest = {
            quantity,
            medicineId
        };

        const response = await this.api.post<CreateResponse>(`/order-item/order/${orderId}`, createOrderItemRequest);
        return response;
    }

    async getAllOrderItem(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<OrderItemResponse[]>> {
        const response = await this.api.get<OrderItemResponse[]>(`/order-item?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getOrderItemById(orderItemId: string): Promise<ApiResponse<OrderItemResponse>> {
        const response = await this.api.get<OrderItemResponse>(`/order-item/${orderItemId}`);
        return response;
    }
    async getOrderItemByOrderId(orderId: string): Promise<ApiResponse<OrderItemResponse[]>> {
        const response = await this.api.get<OrderItemResponse[]>(`/order-item/order/${orderId}`);
        return response;
    }
}

export default OrderItemService;