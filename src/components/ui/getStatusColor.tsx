import React from 'react';

export default function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case 'Pendente':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        case 'confirmed':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        case 'Em processamento':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
        case 'shipped':
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
        case 'Concluido':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'Cancelado':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
}


export function getStatusColorBoolean(status: Boolean) {
    if (status) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    } else {
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
}
