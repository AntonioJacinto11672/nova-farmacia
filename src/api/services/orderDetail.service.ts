import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class OrderDetailService{

    api = new ApiService();
    authService = new AuthService();

    async culculate(request: CalculateRequest[]): Promise<ApiResponse<CalculateResponse>> {
       
        const response = await this.api.post<CalculateResponse>('/order-detail/calculate', request);
        return response;
    }

    async registerOrder(request: CreateOrderDetailRequest): Promise<ApiResponse<CreateResponse>> {
       
        const response = await this.api.post<CreateResponse>('/order-detail', request);
        return response;
    }
}

export default OrderDetailService