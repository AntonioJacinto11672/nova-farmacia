import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface User {
  id: string
  name: string
  email: string
  age: number
  sex: string
  address: string
  phone: string
  role: 'user' | 'admin'
}

export interface AuthResponse {
  user: User
  token: string
}

// Simulação de banco de dados em memória
const users: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin NETFARMA',
    email: 'admin@netfarma.com',
    age: 30,
    sex: 'M',
    address: 'Rua Admin, 123',
    phone: '912345678',
    role: 'admin',
    password: '$2a$10$rOqgGqXxKJqKqKqKqKqKqO' // password: admin123
  }
]

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  })
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function login(email: string, password: string): Promise<AuthResponse | null> {
  const user = users.find(u => u.email === email)
  
  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  console.log("Verify ", isValidPassword);
  if (!isValidPassword) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  const token = generateToken(userWithoutPassword)

  return {
    user: userWithoutPassword,
    token
  }
}

export async function register(userData: {
  name: string
  email: string
  age: number
  sex: string
  address: string
  phone: string
  password: string
}): Promise<AuthResponse> {
  const hashedPassword = await hashPassword(userData.password)
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    password: hashedPassword,
    role: 'user' as const
  }

  users.push(newUser)
  
  const { password: _, ...userWithoutPassword } = newUser
  const token = generateToken(userWithoutPassword)

  return {
    user: userWithoutPassword,
    token
  }
}

export function getUserById(id: string): User | null {
  const user = users.find(u => u.id === id)
  if (!user) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
