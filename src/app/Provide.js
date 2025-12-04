'use client';

import { store } from '@/lib/redux/store'
import React from 'react'
import { Provider } from 'react-redux'

export default function Provide({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
