import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class MedicineService{

    api = new ApiService();
    authService = new AuthService();

    async createMedicine(name: string,  quantity: number, price: number, description: string, providerId: string): Promise<ApiResponse<CreateResponse>> {
        const createMedicineRequest: CreateMedicineRequest = {
            name,
            quantity,
            price,
            description
        };

        const response = await this.api.post<CreateResponse>(`/medicines/provider/${providerId}`, createMedicineRequest);
        return response;
    }

    async createMedicineCategory(medicineId: string, categoryIds: string[]): Promise<ApiResponse<CreateResponse>> {
      
        const response = await this.api.post<CreateResponse>(`/medicines/${medicineId}`, categoryIds);
        return response;
    }

    async getAllMediciine(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<MedicineResponse[]>> {
        const response = await this.api.get<MedicineResponse[]>(`/medicines?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getMediciineById(medicineId: string): Promise<ApiResponse<MedicineResponse>> {
        const response = await this.api.get<MedicineResponse>(`/medicines/${medicineId}`);
        return response;
    }
    async getMedicineByProviderId(providerId: string): Promise<ApiResponse<MedicineResponse[]>>{
        const response = await this.api.get<MedicineResponse[]>(`/medicines/provider/${providerId}`);
        return response;
    }

}

export default MedicineService;