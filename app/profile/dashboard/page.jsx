'use client'
import ProfileLayout from '@/components/profile/ProfileLayout'
import React, { useState } from 'react'
import KabenetBox from '@/components/profile/Lichniykabenet/kabenetBox'

export default function Dashboard() {
    const [step, setStep] = useState(0)

    return (
        <ProfileLayout>
            <KabenetBox />
        </ProfileLayout>
    )
}
