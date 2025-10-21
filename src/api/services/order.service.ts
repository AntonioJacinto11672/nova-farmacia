import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class OrderService {

    api = new ApiService();
    authService = new AuthService();

    async createOrder(userId: string): Promise<ApiResponse<CreateResponse>> {
    
        const response = await this.api.post<CreateResponse>(`/orders/user/${userId}`, {});
        return response;
    }

    async getAllOrder(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<OrderResponse[]>> {
        const response = await this.api.get<OrderResponse[]>(`/orders?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getOrderById(orderId: string): Promise<ApiResponse<OrderResponse>> {
        const response = await this.api.get<OrderResponse>(`/orders/${orderId}`);
        return response;
    }
    async getOrderByUserId(userId: string,pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<OrderResponse[]>> {
        const response = await this.api.get<OrderResponse[]>(`/orders/user/${userId}?&pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
}

export default OrderService;