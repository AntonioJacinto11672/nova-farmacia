import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class ExpenseService {

    api = new ApiService();
    authService = new AuthService();

    async createExpense(name: string, rate: number): Promise<ApiResponse<CreateResponse>> {
        const createExpenseRequest: CreateExpenseRequest = {
            name,
            rate
        };

        const response = await this.api.post<CreateResponse>(`/expense`, createExpenseRequest);
        return response;
    }

    async getAllExpense(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<ExpenseResponse[]>> {
        const response = await this.api.get<ExpenseResponse[]>(`/expense?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getExpenseById(expenseId: string): Promise<ApiResponse<ExpenseResponse>> {
        const response = await this.api.get<ExpenseResponse>(`/expense/${expenseId}`);
        return response;
    }
}

export default ExpenseService;