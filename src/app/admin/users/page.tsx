"use client"
import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/admin.service'

type User = {
  id: string
  name: string
  phone?: string
  email?: string
  role?: string
  status?: 'active' | 'blocked'
}

function UserRow({ u, onEdit, onDelete, onToggle }: { u: User; onEdit: (u: User) => void; onDelete: (id: string) => void; onToggle: (id: string) => void }) {
  return (
    <tr>
      <td className="px-4 py-2 border">{u.name}</td>
      <td className="px-4 py-2 border">{u.phone}</td>
      <td className="px-4 py-2 border">{u.role}</td>
      <td className="px-4 py-2 border">{u.status}</td>
      <td className="px-4 py-2 border">
        <div className="flex gap-2">
          <button onClick={() => onEdit(u)} className="px-3 py-1 bg-blue-600 text-white rounded">Editar</button>
          <button onClick={() => onToggle(u.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">{u.status === 'active' ? 'Bloquear' : 'Desbloquear'}</button>
          <button onClick={() => onDelete(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<any>({ name: '', phone: '', email: '', role: 'Admin' })

  const load = async () => {
    setLoading(true)
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', phone: '', email: '', role: 'Admin' })
    setShowModal(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ name: u.name, phone: u.phone, email: u.email, role: u.role })
    setShowModal(true)
  }

  const save = async () => {
    if (editing) {
      await updateUser(editing.id, { ...editing, ...form })
    } else {
      await createUser({ ...form })
    }
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar utilizador?')) return
    await deleteUser(id)
    load()
  }

  const toggle = async (id: string) => {
    const u = users.find(x => x.id === id)
    if (!u) return
    await updateUser(id, { ...u, status: u.status === 'active' ? 'blocked' : 'active' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gerir Utilizadores</h2>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded">Adicionar Novo</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Telefone</th>
              <th className="px-4 py-2 border">Papel</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
            ) : (
              users.map(u => <UserRow key={u.id} u={u} onEdit={openEdit} onDelete={handleDelete} onToggle={toggle} />)
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{editing ? 'Editar Utilizador' : 'Novo Utilizador'}</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome" className="w-full border p-2 rounded" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Telefone" className="w-full border p-2 rounded" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full border p-2 rounded" />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border p-2 rounded">
                <option>Admin</option>
                <option>Entregador</option>
                <option>Suporte</option>
                <option>Cliente</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancelar</button>
              <button onClick={save} className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
