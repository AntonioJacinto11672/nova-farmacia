import ApiService from "../common/api.service";
import AuthService from "./auth.service";
class AddressService {

    api = new ApiService();
    authService = new AuthService();

    async createAddress(country: string, state: string, city: string, neighborhood: string, street: string,
         number: string, complement: string, latitude: number, longitude: number, userId: string): Promise<ApiResponse<CreateResponse>> {
        const createAddressRequest: CreateAddressRequest = {
            country,
            state,
            city,
            neighborhood,
            street,
            number,
            complement,
            latitude,
            longitude,
        };

        const response = await this.api.post<CreateResponse>(`/address/user/${userId}`, createAddressRequest);
        return response;
    }
    async getAddressByUserId(userId: string): Promise<ApiResponse<AddressResponse>> {
        const response = await this.api.get<AddressResponse>(`/address/user/${userId}`);
        return response;
    }

}

export default AddressService