import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class OrderFileService {

    api = new ApiService();
    authService = new AuthService();

    async createOrderFile(orderId: string, file: any): Promise<ApiResponse<CreateResponse>> {
    
        const response = await this.api.post<CreateResponse>(`/order-file/order/${orderId}`, file, true);
        return response;
    }

    async getAllOrderFile(): Promise<ApiResponse<OrderFileResponse[]>> {
        const response = await this.api.get<OrderFileResponse[]>('/order-file');
        return response;
    }
    async getOrderFileById(orderFileId: string): Promise<ApiResponse<OrderFileResponse>> {
        const response = await this.api.get<OrderFileResponse>(`/order-file/${orderFileId}`);
        return response;
    }
    async getOrderFileByOrderId(orderId: string): Promise<ApiResponse<OrderFileResponse[]>> {
        const response = await this.api.get<OrderFileResponse[]>(`/order-file/order/${orderId}`);
        return response;
    }
}

export default OrderFileService;