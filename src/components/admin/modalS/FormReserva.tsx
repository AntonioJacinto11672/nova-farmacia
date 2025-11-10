import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { providerFormSchema, ProviderFormValues } from '@/lib/validations/provider';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function FormReserva() {
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
        reset,
        setValue,
      } = useForm<ProviderFormValues>({
        resolver: zodResolver(providerFormSchema),
        mode: 'onTouched',
        defaultValues: { name: '', description: '', providerType: 'Local', status: 'ativo' },
      })

      const [loading, setLoading] = React.useState(false);
      const [showModal, setShowModal] = React.useState(true);
      const submitCreateOrEdit = async (data: ProviderFormValues) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Form data submitted:', data);
            setLoading(false);
            reset();
        }, 2000);
        };


  return (
    <div>
        <form onSubmit={handleSubmit(submitCreateOrEdit)} className="space-y-4">
              {/* Name input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900">Nome do Fornecedor</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={`${errors.name ? 'border-red-500' : touchedFields.name ? 'border-green-500' : ''}`}
                  placeholder="Nome do fornecedor"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Description textarea */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900">Descrição</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  className={`w-full rounded border px-3 py-2 ${errors.description ? 'border-red-500' : touchedFields.description ? 'border-green-500' : 'border-gray-300'}`}
                  placeholder="Descrição curta do fornecedor"
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              {/* Radio buttons for provider type */}
              <div>
                <Label className="text-gray-900">Tipo</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input {...register('providerType')} type="radio" value="Local" defaultChecked />
                    <span>Local</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input {...register('providerType')} type="radio" value="Distribuidor" />
                    <span>Distribuidor</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input {...register('providerType')} type="radio" value="Outro" />
                    <span>Outro</span>
                  </label>
                </div>
              </div>

              {/* Select for status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-900">Estado</Label>
                <select id="status" {...register('status')} className={`w-full rounded border px-3 py-2 ${errors.status ? 'border-red-500' : touchedFields.status ? 'border-green-500' : 'border-gray-300'}`}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); reset() }} className="px-4 py-2 rounded border">Cancelar</button>
                <button type="submit" disabled={isSubmitting || loading} className="px-4 py-2 rounded bg-blue-600 text-white">{isSubmitting || loading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
    </div>
  );
}
