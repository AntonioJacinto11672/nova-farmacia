type User = {
  id: string
  name: string
  phone?: string
  email?: string
  role?: string
  status?: 'active' | 'blocked'
}

const STORAGE_KEY = 'nf_admin_users'

function seed() {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(STORAGE_KEY)) {
    const sample: User[] = [
      { id: '1', name: 'Administrador', phone: '900000000', email: 'admin@nf.test', role: 'Admin', status: 'active' },
      { id: '2', name: 'Entregador 1', phone: '911111111', email: 'entrega@nf.test', role: 'Entregador', status: 'active' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample))
  }
}

export async function getUsers(): Promise<User[]> {
  if (typeof window === 'undefined') return []
  seed()
  const raw = localStorage.getItem(STORAGE_KEY) || '[]'
  return JSON.parse(raw)
}

export async function createUser(data: Partial<User>): Promise<User> {
  const list = await getUsers()
  const id = Date.now().toString()
  const u: User = { id, name: data.name || 'Sem nome', phone: data.phone, email: data.email, role: data.role || 'Cliente', status: 'active' }
  list.push(u)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return u
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const list = await getUsers()
  const idx = list.findIndex(x => x.id === id)
  if (idx === -1) return null
  const updated = { ...list[idx], ...data }
  list[idx] = updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return updated
}

export async function deleteUser(id: string): Promise<void> {
  const list = await getUsers()
  const filtered = list.filter(x => x.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Placeholders for other services
export const getProducts = async () => []
export const getCategories = async () => []
export const getOrders = async () => []
