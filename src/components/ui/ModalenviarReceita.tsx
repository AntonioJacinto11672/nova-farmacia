import React from 'react';
import { int } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Upload } from 'lucide-react';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';

interface ModalenviarReceitaProps {
  setShowPrescriptionModal: (show: boolean) => void;
  prescriptionFile: File | null;
  handlePrescriptionUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrescriptionSubmit: () => void;
}
export default function ModalenviarReceita( {
  setShowPrescriptionModal,
  prescriptionFile,
  handlePrescriptionUpload,
  handlePrescriptionSubmit
}: ModalenviarReceitaProps) {
  return (
    <div>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enviar Receita Médica</CardTitle>
              <CardDescription>
                Faça upload da sua receita médica para este medicamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="prescription" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Clique para selecionar ou arraste aqui
                  </span>
                </Label>
                <Input
                  id="prescription"
                  type="file"
                  accept="image/*"
                  onChange={handlePrescriptionUpload}
                  className="hidden"
                />
                {prescriptionFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Arquivo selecionado: {prescriptionFile.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrescriptionSubmit}
                  disabled={!prescriptionFile}
                  className="flex-1"
                >
                  Enviar Receita
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
