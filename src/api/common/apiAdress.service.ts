class ApiAdressService {
  baseURL: string;

  constructor(baseURL: string = "https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias") {
    this.baseURL = baseURL;
  }



  async getProvincias() {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching provincias:', error);
      throw error;
    }
  }

  async getProvinciaBySlug(slug: string) {
    try {
      const response = await fetch(`${this.baseURL}/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    }
    catch (error) {
      console.error('Error fetching provincia by slug:', error);
      throw error;
    }
  }
}

export default ApiAdressService;