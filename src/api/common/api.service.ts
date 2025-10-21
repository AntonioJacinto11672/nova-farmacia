
import AuthInterceptor from "../interceptor/auth.interceptor";
class ApiService {
  baseURL: string;
  authInterceptor: AuthInterceptor;

  constructor(baseURL: string = "http://localhost:3001/api") {
    this.baseURL = baseURL;
    this.authInterceptor = new AuthInterceptor();
  }

  private async fetchWithAuth<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const interceptedOptions = await this.authInterceptor.intercept(options);

    const response = await fetch(`${this.baseURL}${endpoint}`, interceptedOptions);
    const data = await response.json();
    if (!response.ok){
      return { error: data };
    }
    //console.log(data);
    return {data: {
      pageSize: data.pageSize ?? 0,
      pageNumber: data.pageNumber ?? 0,
      total: data.total ?? 0,
      totalPages: data.totalPages ?? 0,
      data: data.data ?? data
    }} ;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, {});
  }

  async post<T>(endpoint: string, data: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithAuth<T>(endpoint, {
      method: 'DELETE',
    });
  }
  async getWitch<T>(endpoint: string, accessToken: string): Promise<ApiResponse<T>> {
    //console.log("token  ", accessToken);
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    if (!response.ok){
      return { error: data };
    }
    
    //console.log(data);
    return { data };
  }
}

export default ApiService;