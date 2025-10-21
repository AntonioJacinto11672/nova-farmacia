import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class RoleService {

    api = new ApiService();
    authService = new AuthService();

    async createRole(name: string): Promise<ApiResponse<CreateResponse>> {
        const createRoleRequest: CreateRoleRequest = {
            name
        };

        const response = await this.api.post<CreateResponse>('/role', createRoleRequest);
        return response;
    }

    async getAllRole(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<RoleResponse[]>> {
        const response = await this.api.get<RoleResponse[]>(`/role?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getRoleById(roleId: string): Promise<ApiResponse<RoleResponse>> {
        const response = await this.api.get<RoleResponse>(`/role/${roleId}`);
        return response;
    }
}

export default RoleService;