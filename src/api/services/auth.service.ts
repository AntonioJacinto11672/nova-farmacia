import { getSession } from "next-auth/react";
class AuthService {
    async getToken(): Promise<string> {
      const session = await getSession();
      const accessToken = session?.user?.accessToken;
  
      if (!accessToken) {
        throw new Error("Access token not available");
      }
  
      return accessToken;
    }
  }
  
  export default AuthService;