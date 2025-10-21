import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class ImposedService {

    api = new ApiService();
    authService = new AuthService();

    async createImposed(name: string, rate: number): Promise<ApiResponse<CreateResponse>> {
        const createImposedRequest: CreateImposedRequest = {
            name,
            rate
        };

        const response = await this.api.post<CreateResponse>(`/imposed`, createImposedRequest);
        return response;
    }

    async getAllImposed(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<ImposedResponse[]>> {
        const response = await this.api.get<ImposedResponse[]>(`/imposed?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getImposedById(imposedId: string): Promise<ApiResponse<ImposedResponse>> {
        const response = await this.api.get<ImposedResponse>(`/imposed/${imposedId}`);
        return response;
    }
}

export default ImposedService;