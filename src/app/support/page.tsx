'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, MessageCircle, Phone, Mail, MapPin, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/include/Header'

const faqs = [
  {
    id: 1,
    question: "Como faço um pedido?",
    answer: "É muito simples! Navegue pelos produtos, adicione ao carrinho e finalize a compra. Você pode pagar via Multicaixa Express ou transferência bancária."
  },
  {
    id: 2,
    question: "Qual o prazo de entrega?",
    answer: "Oferecemos três modalidades: Geral (2-3 dias úteis), Urgente (24h) e Não Urgente (5-7 dias úteis). O prazo varia conforme sua localização."
  },
  {
    id: 3,
    question: "Preciso de receita médica?",
    answer: "Alguns medicamentos exigem receita médica. Durante o pedido, você pode enviar a receita digitalizada através do nosso sistema de upload."
  },
  {
    id: 4,
    question: "Como rastrear meu pedido?",
    answer: "Após a confirmação do pagamento, você receberá um código de rastreamento. Acesse a página de rastreamento para acompanhar em tempo real."
  },
  {
    id: 5,
    question: "Posso cancelar meu pedido?",
    answer: "Sim, você pode cancelar pedidos que ainda não foram processados. Entre em contato conosco o mais rápido possível."
  },
  {
    id: 6,
    question: "Quais formas de pagamento aceitas?",
    answer: "Aceitamos Multicaixa Express, transferência bancária, cartão de crédito/débito e pagamento na entrega (para algumas regiões)."
  }
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleWhatsApp = (message: string) => {
    const phoneNumber = "244912345678" // Número de exemplo
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria o envio do formulário
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Suporte ao Cliente</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou consulte nossas perguntas frequentes.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>Resposta rápida via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleWhatsApp("Olá, preciso de ajuda com meu pedido")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Conversar no WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Telefone</CardTitle>
              <CardDescription>Ligue para nós</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-2">+244 912 345 678</p>
              <p className="text-sm text-gray-600">Seg-Sex: 8h às 18h</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Email</CardTitle>
              <CardDescription>Envie-nos um email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-gray-900 mb-2">suporte@netfarma.com</p>
              <p className="text-sm text-gray-600">Resposta em até 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Envie-nos uma Mensagem</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e entraremos em contato o mais breve possível.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Qual é o assunto da sua mensagem?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Descreva sua dúvida ou problema..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {openFaq === faq.id && (
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <CardTitle>Endereço</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Rua da Saúde, 123<br />
                Luanda, Angola<br />
                Código Postal: 1000
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <CardTitle>Horário de Funcionamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Segunda - Sexta: 8h às 18h<br />
                Sábado: 8h às 14h<br />
                Domingo: Fechado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <CardTitle>Outros Contatos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Parcerias: parceiros@netfarma.com<br />
                Fornecedores: fornecedores@netfarma.com<br />
                Emergência: +244 923 456 789
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => handleWhatsApp("Olá, preciso de ajuda com meu pedido")}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-white text-lg">NETFARMA</div>
            <p className="mt-2 text-sm">Sua saúde, nossa prioridade.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Quem Somos</div>
            <p className="mt-2 text-sm">Empresa dedicada à entrega de medicamentos com segurança e agilidade.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Contactos</div>
            <p className="mt-2 text-sm">Email: suporte@netfarma.com</p>
            <p className="text-sm">Parcerias: parceiros@netfarma.com</p>
          </div>
          <div>
            <div className="font-semibold text-white">Links</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-white">Suporte</Link></li>
              <li><Link href="/about" className="hover:text-white">Quem Somos</Link></li>
              <li><Link href="/auth/login" className="hover:text-white">Entrar</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} NETFARMA</div>
      </footer>
    </div>

  )
}
