/**
 * @deprecated This interceptor is no longer needed
 * 
 * The application now uses HTTP-Only cookies for authentication.
 * Cookies are automatically included in requests with credentials: 'include'
 * in the ApiService.fetchWithAuth method.
 * 
 * This file is kept for reference but is not used.
 */
class AuthInterceptor {
  async intercept(request: RequestInit): Promise<RequestInit> {
    // This method is deprecated and should not be used
    // HTTP-Only cookies are now handled automatically
    return request;
  }
}

export default AuthInterceptor;
