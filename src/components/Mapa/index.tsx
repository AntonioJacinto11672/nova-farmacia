'use client'

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L, { LatLngLiteral } from 'leaflet'

// Corrigir ícone do marker
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type AddressType = {
    country?: string
    state?: string
    city?: string
    municipality?: string
    suburb?: string
    road?: string,
    display_name?: string
}

function LocationSelector({
    onSelect,
}: {
    onSelect: (pos: LatLngLiteral) => void
}) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng)
        },
    })

    return null
}

export default function MapClient() {
    const [position, setPosition] = useState<LatLngLiteral | null>(null)
    const [address, setAddress] = useState<AddressType | null>(null)

    // 🔁 Reverse Geocoding
    const fetchAddress = async (lat: number, lon: number) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        )
        const data = await res.json()

        console.log('Reverse Geocoding Data:', data)
        setAddress({
            country: data.address?.country,
            state: data.address?.state,
            city: data.address?.city,
            municipality: data.address?.village || data.address?.town || data.address?.municipality || data.address?.county,
            suburb: data.address?.suburb,
            road: data.address?.road,
            display_name: data?.display_name,
        })
    }

    // 📍 Localização inicial
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }
                setPosition(coords)
                fetchAddress(coords.lat, coords.lng)
            },
            () => alert('Não foi possível obter localização')
        )
    }, [])

    if (!position) return <p className="text-center">A obter localização...</p>

    return (
        <>
            <MapContainer
                center={position}
                zoom={16}
                style={{ height: '500px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Clique no mapa */}
                <LocationSelector
                    onSelect={(pos) => {
                        setPosition(pos)
                        fetchAddress(pos.lat, pos.lng)
                    }}
                />

                {/* Marcador arrastável */}
                <Marker
                    position={position}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target
                            const pos = marker.getLatLng()
                            setPosition(pos)
                            fetchAddress(pos.lat, pos.lng)
                        },
                    }}
                >
                    <Popup>📍 Local selecionado</Popup>
                </Marker>
            </MapContainer>

            {/* 📄 Endereço */}
            <div className="mt-4 p-4 border rounded space-y-1">
                <p><strong>Latitude:</strong> {position.lat}</p>
                <p><strong>Longitude:</strong> {position.lng}</p>
                <p><strong>País:</strong> {address?.country}</p>
                <p><strong>Província:</strong> {address?.state}</p>
                <p><strong>Município:</strong> {address?.city || address?.municipality}</p>
                <p><strong>Bairro:</strong> {address?.suburb}</p>
                <p><strong>Rua:</strong> {address?.road}</p>
                <p><strong>display Name:</strong> {address?.display_name}</p>

            </div>
        </>
    )
}
