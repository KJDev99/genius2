'use client'
import LeftPanel from '@/components/profile/Dashboard/left-panel'
import React from 'react'

export default function ProfileLayout({ children }) {
    return (
        <div className='flex gap-[30px] max-w-[1340px] m-auto max-md:px-4 max-md:flex-col'>
            <div className="flex-shrink-0">
                <LeftPanel />
            </div>
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}
