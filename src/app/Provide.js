'use client';

import AuthProvider from '@/components/AuthProvider';
import React from 'react'


export default function Provide({ children }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}
