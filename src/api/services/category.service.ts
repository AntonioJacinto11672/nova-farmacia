import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class CategoryService {

    api = new ApiService();
    authService = new AuthService();

    async createCategory(name: string, description: string): Promise<ApiResponse<CreateResponse>> {
        const createCategoryRequest: CreateCategoryRequest = {
            name,
            description
        };

        const response = await this.api.post<CreateResponse>('/category', createCategoryRequest);
        return response;
    }

    async getAllCategory(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<CategoryResponse[]>> {
        const response = await this.api.get<CategoryResponse[]>(`/category?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getCategoryById(categoryId: string): Promise<ApiResponse<CategoryResponse>> {
        const response = await this.api.get<CategoryResponse>(`/category/${categoryId}`);
        return response;
    }
}

export default CategoryService;