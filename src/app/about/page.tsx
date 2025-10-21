"use client"
import React from 'react'
import Header from '@/components/include/Header'
import Footer from '@/components/include/Footer'
import Image from 'next/image'
import teamPic from '@/assets/carrocel/about.jpg'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Conheça a Nossa História</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">A NETFARMA nasceu para facilitar o acesso a medicamentos e produtos de saúde com rapidez, segurança e cuidado humano.</p>
        </section>

        {/* Mission / Vision */}
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Nossa Missão</h3>
            <p className="text-gray-600">Prover soluções de saúde acessíveis e confiáveis para todas as famílias, com atendimento de excelência.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Nossa Visão</h3>
            <p className="text-gray-600">Ser a plataforma de saúde mais próxima das pessoas, reconhecida por qualidade e inovação.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Nossos Valores</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Segurança</li>
              <li>Transparência</li>
              <li>Empatia</li>
              <li>Excelência</li>
            </ul>
          </div>
        </section>

        {/* Timeline / History */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Nossa Jornada</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">2015</div>
              <div className="font-semibold">Fundação</div>
              <p className="text-gray-600">Começámos com uma pequena equipa dedicada a entregar medicamentos localmente.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">2019</div>
              <div className="font-semibold">Crescimento</div>
              <p className="text-gray-600">Expandimos a oferta e implementámos processos de qualidade e rastreabilidade.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500">2023</div>
              <div className="font-semibold">Inovação</div>
              <p className="text-gray-600">Lançámos a plataforma online e o app para aproximar saúde e tecnologia.</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">A Nossa Equipa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="mx-auto mb-4 w-32 h-32 relative rounded-full overflow-hidden">
                <Image src={teamPic} alt="Team" fill className="object-cover" />
              </div>
              <div className="font-semibold">Dr. Maria Silva</div>
              <div className="text-sm text-gray-500">Diretora Clínica</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="mx-auto mb-4 w-32 h-32 relative rounded-full overflow-hidden">
                <Image src={teamPic} alt="Team" fill className="object-cover" />
              </div>
              <div className="font-semibold">João Pereira</div>
              <div className="text-sm text-gray-500">CTO</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="mx-auto mb-4 w-32 h-32 relative rounded-full overflow-hidden">
                <Image src={teamPic} alt="Team" fill className="object-cover" />
              </div>
              <div className="font-semibold">Ana Costa</div>
              <div className="text-sm text-gray-500">Head de Operações</div>
            </div>
          </div>
        </section>

        {/* CTA / Contact */}
        <section className="bg-blue-50 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-semibold">Fale connosco</h3>
              <p className="text-gray-600">Para parcerias, contactos comerciais ou dúvidas, envie-nos uma mensagem.</p>
            </div>
            <div>
              <a href="mailto:suporte@netfarma.com" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg">Contactar</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
