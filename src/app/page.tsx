
'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/assets/logo/NEtFarma.png';
import banner1 from '@/assets/carrocel/c1.jpeg';
import banner2 from '@/assets/carrocel/c2.jpeg';
import banner3 from '@/assets/carrocel/c3.jpeg';
import farmaco from '@/assets/farmaco.jpg';
import ProductCard from '@/components/ui/ProductCard'
import chiringa from '@/assets/carrocel/about.jpg';
const categories = [
  { name: 'Pele e Estética', slug: 'pele-e-estetica' },
  { name: 'Nutrição e Saúde', slug: 'nutricao-e-saude' },
  { name: 'Gravidez', slug: 'gravidez' },
  { name: 'Bebês', slug: 'bebes' },
  { name: 'Suplementação', slug: 'suplementacao' },
  { name: 'Sexualidade', slug: 'sexualidade' },
  { name: 'Eletrónicos', slug: 'eletronicos' },
];

function HomePage() {
  // Carousel state for full-width carousel
  const banners = [
    { src: banner1, alt: 'Bem-vindo à Netfarma', caption: 'Bem-vindo à Netfarma', sub: 'Sua saúde em primeiro lugar' },
    { src: banner2, alt: 'Promoções em saúde', caption: 'Promoções', sub: 'Até 30% OFF' },
    { src: banner3, alt: 'Cuidados essenciais', caption: 'Cuidados Essenciais', sub: 'Receba em casa' },
  ];
  const [cartCount, setCartCount] = React.useState(0);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center" style={{ minWidth: 120 }}>
            <Link href="/" className="flex items-center">
              <div className="relative w-20 h-12 md:w-32 md:h-16">
                <Image src={logoImg} alt="NETFARMA" fill className="object-contain" />
              </div>
            </Link>
          </div>
          {/* Search center */}
          <div className="flex-1 flex justify-center">
            <form className="w-full max-w-md flex gap-2">
              <input className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" placeholder="Pesquisar produtos..." />
              <button type="submit" className="rounded-md bg-blue-600 px-4 text-white">Pesquisar</button>
            </form>
          </div>
          {/* Menu */}
          <div className="flex-shrink-0" style={{ minWidth: 220 }}>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 justify-end">

              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 relative overflow-hidden"
                  title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
                >
                  <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-y-full' : 'translate-y-0'}`}>
                    {/* Sun Icon */}
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-y-0' : '-translate-y-full'}`}>
                    {/* Moon Icon */}
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                </button>

                {/* Cart Icon */}
                <div className="relative group">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <Link href="/products" className="hover:text-blue-600">Produtos</Link>
              <Link href="/support" className="hover:text-blue-600">Suporte</Link>
              <Link href="/auth/login" className="hover:text-blue-600">Entrar</Link>

            </nav>
          </div>
        </div>
      </header>

      {/* Full-width Carousel */}
      <div className="relative w-full h-[260px] md:h-[400px] bg-gray-200 overflow-hidden">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute left-8 bottom-10 text-white drop-shadow-lg">
              <div className="text-2xl md:text-4xl font-bold">{banner.caption}</div>
              <div className="text-lg md:text-2xl font-medium">{banner.sub}</div>
            </div>
          </div>
        ))}
        {/* Carousel dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border border-white ${idx === current ? 'bg-white' : 'bg-transparent'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <main className="flex-1">


        {/* Categorias - horizontal scrollable row */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Categorias</h2>
              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition">
                Ver mais
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx global>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="flex-shrink-0 group rounded-lg border bg-white px-6 py-4 min-w-[160px] flex flex-col items-center hover:shadow transition-all relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-2 flex items-center justify-center text-blue-700 text-xl font-bold">
                    {cat.name[0]}
                  </div>
                  <div className="font-medium group-hover:text-blue-600 text-center text-sm">{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Destaques */}
        <section className="bg-white border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border overflow-hidden">
              <div className="relative h-40">
                <Image src={banner2} alt="Destaque 1" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="font-semibold">Imunidade & Vitaminas</div>
                <div className="text-sm text-gray-600">Cuide do seu dia a dia</div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="relative h-40">
                <Image src={banner3} alt="Destaque 2" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="font-semibold">Cuidados com a Pele</div>
                <div className="text-sm text-gray-600">Beleza e bem-estar</div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="relative h-40">
                <Image src={banner1} alt="Destaque 3" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="font-semibold">Entrega Rápida</div>
                <div className="text-sm text-gray-600">Receba no mesmo dia</div>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos em Destaque - grid */}
        <section className="pt-2 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition">
                Ver todos
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCard key={i} id={i} name={`Produto ${i + 1}`} price={6990 + i * 1000} image={farmaco} onAdd={() => setCartCount(prev => prev + 1)} />
              ))}
            </div>
          </div>
        </section>
        {/* App Download Banner */}
        <section className="bg-gray-900 py-16 my-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Tem tudo em um só app!</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Tenha acesso a todos os medicamentos na palma da sua mão. Compre com facilidade,
                acompanhe seus pedidos e receba em casa com a melhor experiência de compra online.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 rounded-lg px-8 py-3 font-semibold hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341c.965.555 1.68 1.426 1.68 2.659 0 1.055-.534 1.867-1.307 2.457-.773.59-1.787.876-2.984.876H3.934c-1.197 0-2.211-.286-2.984-.876C.177 19.867-.357 19.055-.357 18c0-1.233.715-2.104 1.68-2.659C.357 14.786-.357 13.915-.357 12.682c0-1.055.534-1.867 1.307-2.457.773-.59 1.787-.876 2.984-.876h10.978c1.197 0 2.211.286 2.984.876.773.59 1.307 1.402 1.307 2.457 0 1.233-.715 2.104-1.68 2.659zm-2.984-4.341H3.934c-.773 0-1.307.286-1.68.876-.357.555-.357 1.233-.357 1.806s0 1.251.357 1.806c.373.59.907.876 1.68.876h10.605c.773 0 1.307-.286 1.68-.876.357-.555.357-1.233.357-1.806s0-1.251-.357-1.806c-.373-.59-.907-.876-1.68-.876zm2.984 8.682c0-.573 0-1.251-.357-1.806-.373-.59-.907-.876-1.68-.876H3.934c-.773 0-1.307.286-1.68.876-.357.555-.357 1.233-.357 1.806s0 1.251.357 1.806c.373.59.907.876 1.68.876h10.605c.773 0 1.307-.286 1.68-.876.357-.555.357-1.233.357-1.806z" />
                  </svg>
                  Google Play
                </a>
                <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 rounded-lg px-8 py-3 font-semibold hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Nós Section */}
        {/* Sobre Nós Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid-blue-500/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-600 font-semibold tracking-wider uppercase mb-4 block">Conheça a NETFARMA</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Sobre Nós
              </h2>
              <p className="text-xl text-gray-600">
                Sua parceira em saúde e bem-estar, fornecendo soluções inovadoras e atendimento de excelência
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left side - Icon Composition and Stats */}
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

                  {/* Main Icon Composition */}
                  <div className="relative h-[500px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                    </div>

                    {/* Centered Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Main Circle */}
                        <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          {/* Pharmacy Cross Icon */}
                          <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M18 19H6C5.4 19 5 18.6 5 18V6C5 5.4 5.4 5 6 5H18C18.6 5 19 5.4 19 6V18C19 18.6 18.6 19 18 19M17 9H13V5H11V9H7V11H11V15H13V11H17V9" />
                          </svg>
                        </div>

                        {/* Orbital Elements */}
                        <div className="absolute top-0 left-0 -translate-x-16 -translate-y-16">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute top-0 right-0 translate-x-16 -translate-y-16">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 -translate-x-16 translate-y-16">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute bottom-0 right-0 translate-x-16 translate-y-16">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl backdrop-blur-sm bg-white/90 transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">10+</div>
                        <div className="text-sm font-medium text-gray-800">Anos de Experiência</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">5K+</div>
                        <div className="text-sm font-medium text-gray-800">Clientes Satisfeitos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Features */}
              <div className="lg:col-span-7 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Feature 1 */}
                  <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Qualidade Garantida</h3>
                    </div>
                    <p className="text-gray-600">Produtos selecionados e verificados, garantindo sua segurança e satisfação em cada compra.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Entrega Express</h3>
                    </div>
                    <p className="text-gray-600">Entrega rápida e segura, com rastreamento em tempo real para sua tranquilidade.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Atendimento 24/7</h3>
                    </div>
                    <p className="text-gray-600">Suporte profissional disponível 24 horas por dia, 7 dias por semana.</p>
                  </div>

                  {/* Feature 4 */}
                  <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Preços Justos</h3>
                    </div>
                    <p className="text-gray-600">Melhores preços do mercado com descontos exclusivos para clientes fiéis.</p>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-full font-semibold mt-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Conheça Nossa História
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="transform group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>




      </main>

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
  );
}

export default HomePage;
