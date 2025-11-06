"use client"
import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/admin.service'
import { Controller, FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProviderService from '@/api/services/provider.service';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProviderFormData, providerSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod'

interface Provider {
  id: string;
  name: string;
  isActive?: string
}
const PAGE_SIZE = 10;
type User = {
  id: string
  name: string
  phone?: string
  email?: string
  role?: string
  status?: 'active' | 'blocked'
}

export default function ProvidernUsers() {

  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  })

  const router = useRouter()


  // Estado para lista de providers
  const [providers, setProviders] = React.useState<Provider[]>([]);
  // Estado para página atual
  const [page, setPage] = React.useState(1);
  const [totalPage, settotalPage] = React.useState(0)
  const [totalElement, setTotalElement] = React.useState(0)
  // Estado para controle de carregamento
  const [loading, setLoading] = React.useState(false);
  // Estado para saber se há mais dados
  const [hasMore, setHasMore] = React.useState(true);



  // Busca providers ao carregar ou mudar página
  React.useEffect(() => {

    fetchProviders();
  }, [page]);

  async function fetchProviders() {
    setLoading(true);
    const service = new ProviderService();
    try {
      const response = await service.getAllProvider(PAGE_SIZE, page);


      setProviders(response.data?.data || []);
      // Se vier menos que PAGE_SIZE, não tem mais dados

      //setHasMore((response.data?.totalPages || 0) >== PAGE_SIZE);
      settotalPage(response.data?.totalPages || 0)
      setTotalElement(response.data?.total || 0)
      console.log("response provider", response)
    } catch (err) {
      setProviders([]);
      setHasMore(false);
    }
    setLoading(false);
  }
  // Funções de navegação
  function handlePrev() {
    if (page > 1) setPage(page - 1);
  }
  function handleNext(currentPage: number, totalNumberPages: number) {
    console.log("hasMore", currentPage)
    //if (hasMore) setPage(page + 1);
    if ((currentPage + 1) <= totalNumberPages) {
      setPage(currentPage + 1)
    } else {
      setPage(currentPage + 1)
    }
  }


  const openCreate = () => {
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (u: any) => {
    setEditing(u)
    setShowModal(true)
  }



  const onSubmit = async (data: ProviderFormData) => {


    const toastId = toast("Vai Fazer o cadastro...")



    //Envia o Producto Para backend

    const sendProviders = new ProviderService();

    const result = await sendProviders.createProvider(data.provider)

    if (result.data) {
      toast.success("Fornecedor criado com sucesso")
      router.refresh()


    }

    if (result.error) {
      console.log("Error: cadastrar Fornecedor ", result.error)
      router.refresh()
      toast.success("Erro ao cadastrar a Fornecedor!")

    }

    toast.dismiss(toastId)
    setShowModal(false)
    await fetchProviders()

  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar utilizador?')) return
   
    await fetchProviders()
  }

  const toggle = async (id: string) => {
    
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gerir Fornecedores</h2>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded">Adicionar Novo</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Gerenciar Fornecedores</h1>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th>ação</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    {loading ? "Carregando..." : "Nenhum fornecedor encontrado."}
                  </td>
                </tr>
              )}
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td className="py-2 px-4 border-b">{provider.id}</td>
                  <td className="py-2 px-4 border-b">{provider.name}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(provider)} className="px-3 py-1 bg-blue-600 text-white rounded">Editar</button>
                      <button onClick={() => toggle(provider.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">{provider.isActive ? 'Bloquear' : 'Desbloquear'}</button>
                      <button onClick={() => handleDelete(provider.id)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {page} de {totalPage}, Elementos {providers.length} de  {totalElement}  </span>
            <button
              onClick={() => handleNext(page, totalPage)}
              disabled={!(page < totalPage)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"

            >
              Seguinte
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-md w-full p-6">
            <form action="" method="post" onSubmit={handleSubmit(onSubmit)} className="needs-validation" encType="multipart/form-data" noValidate>

              <h3 className="text-lg font-bold mb-4">{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Nome Completo</Label>
                  <Input
                    id="provider"
                    placeholder="Seu nome completo"
                    {...register('provider')}
                    className={`${errors.provider ? 'border-red-500' : ''} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                  />
                  {errors.provider && (
                    <p className="text-sm text-red-500">{errors.provider.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancelar</button>
                <button type='submit' className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
