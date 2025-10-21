import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class ProviderService{

    api = new ApiService();
    authService = new AuthService();

    async createProvider(name: string): Promise<ApiResponse<CreateResponse>> {
        const createProviderRequest: CreateProviderRequest = {
            name
        };

        const response = await this.api.post<CreateResponse>('/providers', createProviderRequest);
        return response;
    }

    async getAllProvider(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<ProviderResponse[]>> {
        const response = await this.api.get<ProviderResponse[]>(`/providers?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getProviderById(providerId: string): Promise<ApiResponse<ProviderResponse>> {
        const response = await this.api.get<ProviderResponse>(`/providers/${providerId}`);
        return response;
    }

}

export default ProviderService