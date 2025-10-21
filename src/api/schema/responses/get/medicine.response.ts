interface MedicineResponse {
  id: string
  name: string
  description: string
  quantity: number
  price: number
  providerId: string
  isActive: boolean
  medicineCategories: CategoryResponse
  medicineFiles: MedicineFileResponse
} 