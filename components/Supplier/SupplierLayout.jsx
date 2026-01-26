'use client'
import React from 'react'
import SupplierPanel from './SupplierPanel'

export default function SupplierLayout({ children }) {
    return (
        <div className='flex gap-[30px] max-w-[1340px] m-auto max-md:px-4 max-md:flex-col'>
            <div className="flex-shrink-0">
                <SupplierPanel />
            </div>
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}
