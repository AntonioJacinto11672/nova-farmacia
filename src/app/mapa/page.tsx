'use client'
import React from 'react';
import dynamic from 'next/dynamic'
import Header from '@/components/include/Header';
import Footer from '@/components/include/Footer';

const Map = dynamic(() => import('@/components/Mapa'), {
    ssr: false,
})
const DynamicPage = () => {
    return (
        <>
            <Header />
            <h1>Mapa Page</h1>
            <div className=''>
                <Map />
            </div>
            <Footer />
        </>
    )
}

export default DynamicPage;
