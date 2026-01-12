'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import AddressService from '@/api/services/address.service'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Profile form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Avatar preview / upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  

  const [address, setAddress] = useState<any | null>(null)
  const [loadingAddress, setLoadingAddress] = useState(false)



  return (
    <>
      <Header />
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Perfil</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ver e alterar informações do seu perfil</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Editar Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={() => {}} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white" disabled={savingProfile}>
                        {savingProfile ? 'A gravar...' : 'Salvar alterações'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {}}>
                        Recarregar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={() => {}} className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Senha atual</Label>
                      <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirme a nova senha</Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="bg-pharmacy-600 hover:bg-pharmacy-700 text-white" disabled={changingPassword}>
                        {changingPassword ? 'Alterando...' : 'Alterar senha'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}>
                        Limpar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Informações</h3>

                {loading ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">A carregar...</p>
                ) : (
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {/** show image if available, otherwise initials */}
                        { (user?.avatar || user?.photo || user?.picture || user?.image || avatarPreview) ? (
                          <img src={avatarPreview || user?.avatar || user?.photo || user?.picture || user?.image} alt="Avatar" className="w-24 h-24 rounded-full object-cover border" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-pharmacy-600 text-white flex items-center justify-center font-semibold text-xl">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '-'}
                          </div>
                        )}

                        {/* Camera icon for upload */}
                        <label className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 border cursor-pointer" title="Alterar foto">
                          <input type="file" className="hidden" accept="image/*" onChange={() => {}} />
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                          </svg>
                        </label>
                      </div>

                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{user?.name || '-'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || '-'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.phone || '-'}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <p className="text-sm"><strong>Role: </strong>{user?.role || '-'}</p>

                      <div>
                        <p className="text-sm"><strong>Telefone: </strong>{user?.phone || '-'}</p>
                        {loadingAddress ? (
                          <p className="text-sm text-gray-600">A carregar morada...</p>
                        ) : (
                          <p className="text-sm"><strong>Morada: </strong>{'Nenhuma morada cadastrada'}</p>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button onClick={() => {}} variant="outline">Recarregar</Button>
                        <Button onClick={() => { setAvatarPreview(''); toast('Foto resetada (apenas localmente)') }} variant="ghost">Remover foto</Button>
                      </div>
                    </div>

                    {avatarUploading && <p className="text-sm text-gray-600">A enviar foto...</p>}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
