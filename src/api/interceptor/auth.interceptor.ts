class AuthInterceptor {
  async intercept(request: RequestInit): Promise<RequestInit> {
    const accessToken = localStorage.getItem('token');

    if (accessToken) {
      if (!request.headers) {
        request.headers = new Headers();
      }
      if (!(request.headers instanceof Headers)) {
        request.headers = new Headers(request.headers);
      }
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return request;
  }
}

export default AuthInterceptor;
