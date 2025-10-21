import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class OrderStatusService {

    api = new ApiService();
    authService = new AuthService();

    async createOrderStatus(type: string, description: string): Promise<ApiResponse<CreateResponse>> {
        const createOrderStatusRequest: CreateOrderStatusRequest = {
            type,
            description
        };

        const response = await this.api.post<CreateResponse>('/order-status', createOrderStatusRequest);
        return response;
    }

    async getAllOrderStatus(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<OrderStatusResponse[]>> {
        const response = await this.api.get<OrderStatusResponse[]>(`/order-status?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getOrderStatusById(orderStatusId: string): Promise<ApiResponse<OrderStatusResponse>> {
        const response = await this.api.get<OrderStatusResponse>(`/order-status/${orderStatusId}`);
        return response;
    }
}

export default OrderStatusService;