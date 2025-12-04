import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'
import React, { Children } from 'react'

export default function layout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
