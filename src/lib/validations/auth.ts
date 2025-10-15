import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  age: z.number().min(18, "Idade deve ser maior que 18 anos").max(120, "Idade inválida"),
  sex: z.enum(["M", "F", "Outro"], {
    required_error: "Selecione o sexo",
  }),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
