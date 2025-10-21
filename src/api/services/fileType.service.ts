import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class FileTypeService {

    api = new ApiService();
    authService = new AuthService();

    async createFileType(type: string, description: string): Promise<ApiResponse<CreateResponse>> {
        const createFileTypeRequest: CreateFileTypeRequest = {
            type,
            description
        };

        const response = await this.api.post<CreateResponse>(`/file-type`, createFileTypeRequest);
        return response;
    }

    async getAllFileType(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<FileTypeResponse[]>> {
        const response = await this.api.get<FileTypeResponse[]>(`/file-type?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getFileTypeById(fileTypeId: string): Promise<ApiResponse<FileTypeResponse>> {
        const response = await this.api.get<FileTypeResponse>(`/file-type/${fileTypeId}`);
        return response;
    }
}

export default FileTypeService;