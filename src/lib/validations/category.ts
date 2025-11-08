import { z } from 'zod'

export const categoryryFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição muito curta').optional(),
})

export type CategoryFormValues = z.infer<typeof categoryryFormSchema>
