import { z } from 'zod'

export const medicineFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
    price: z.number().min(0, 'Preço deve ser pelo menos 0'),
    description: z.string().min(5, 'Descrição muito curta'),
    providerId: z.string().optional(),
    categoryId: z.array(z.string()).min(1, 'Selecione pelo menos uma categoria'),
    isActive: z.boolean(),
})

export type MedicineFormValues = z.infer<typeof medicineFormSchema>
