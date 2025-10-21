import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class UserService {

    api = new ApiService();
    authService = new AuthService();

    async getAllUser(pageSize: any = 10, pageNumber: any = 1): Promise<ApiResponse<UserResponse[]>> {
        const accessToken = await this.authService.getToken();
        const response = await this.api.get<UserResponse[]>(`/users?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return response;
    }
    async getUserInfo(accessToken:string): Promise<ApiResponse<UserResponse>> {
      
        const response = await this.api.getWitch<UserResponse>('/users/user-info', accessToken);
        return response;
    }
    async signIn(email: string, password: string): Promise<ApiResponse<SignInResponse>> {
        const signInRequest: SignInRequest = {
            email,
            password
        };
        const response = await this.api.post<SignInResponse>('/users/sign-in', signInRequest);
       /*  console.log("teste quero o resultado", response) */
        return response;
    }

    async createAdmin(email: string, password: string, phoneNumber: string): Promise<ApiResponse<CreateUserResponse>> {
        const userRequest: CreateUserRequest = {
            email,
            password,
            phoneNumber
        };

        const response = await this.api.post<CreateUserResponse>('/users/admin', userRequest);
        return response;
    }

    async createClient(email: string, password: string, phoneNumber: string): Promise<ApiResponse<CreateUserResponse>> {
        const userRequest: CreateUserRequest = {
            email,
            password,
            phoneNumber
        };

        const response = await this.api.post<CreateUserResponse>('/users/client', userRequest);
        return response;
    }

    async createEmployee(email: string, password: string, phoneNumber: string): Promise<ApiResponse<CreateUserResponse>> {
        const userRequest: CreateUserRequest = {
            email,
            password,
            phoneNumber
        };

        const response = await this.api.post<CreateUserResponse>('/users/employee', userRequest);
        return response;
    }

}

export default UserService;