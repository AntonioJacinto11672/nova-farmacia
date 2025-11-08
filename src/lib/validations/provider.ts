import { z } from 'zod'

export const providerFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição muito curta').optional(),
  providerType: z.enum(['Local', 'Distribuidor', 'Outro']),
  status: z.enum(['ativo', 'inativo']),
})

export type ProviderFormValues = z.infer<typeof providerFormSchema>
