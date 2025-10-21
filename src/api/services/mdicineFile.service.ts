import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class MedicineFileService {

    api = new ApiService();
    authService = new AuthService();

    async createMedicineFile(medicineId: string, file: any): Promise<ApiResponse<CreateResponse>> {
    
        const response = await this.api.post<CreateResponse>(`/medicine-file/medicine/${medicineId}`, file, true);
        return response;
    }

    async getAllMedicineFile(): Promise<ApiResponse<MedicineFileResponse[]>> {
        const response = await this.api.get<MedicineFileResponse[]>('/medicine-file');
        return response;
    }
    async getMedicineFileById(medicineFileId: string): Promise<ApiResponse<MedicineFileResponse>> {
        const response = await this.api.get<MedicineFileResponse>(`/medicine-file/${medicineFileId}`);
        return response;
    }
    async getMedicineFileByMedicineId(medicineId: string): Promise<ApiResponse<MedicineFileResponse[]>> {
        const response = await this.api.get<MedicineFileResponse[]>(`/medicine-file/medicine/${medicineId}`);
        return response;
    }
}

export default MedicineFileService;