import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class PersonService{

    api = new ApiService();
    authService = new AuthService();

    async createPerson(fullName: string, birthDate: string, gender: string, userId: string): Promise<ApiResponse<CreateResponse>> {
        const createPersonRequest: CreatePersonRequest = {
            fullName,
            birthDate,
            gender
        };

        const response = await this.api.post<CreateResponse>(`/person/user/${userId}`, createPersonRequest);
        return response;
    }
    async getPersonByUserId(userId: string): Promise<ApiResponse<PersonResponse>> {
        const response = await this.api.get<PersonResponse>(`/person/user/${userId}`);
        return response;
    }

}

export default PersonService