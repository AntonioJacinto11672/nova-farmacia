"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Topbar() {
  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold">NETFARMA ADMIN</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>

        <div className="relative">
          <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">U</div>
            <div className="text-sm">Admin</div>
          </button>
        </div>
      </div>
    </div>
  )
}
