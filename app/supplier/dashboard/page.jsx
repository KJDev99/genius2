import SupplierDashboard from '@/components/Supplier/dashboard/supplier-dashboard'
import SupplierLayout from '@/components/Supplier/SupplierLayout'
import React from 'react'

export default function page() {
    return (
        <SupplierLayout>
            <SupplierDashboard />
        </SupplierLayout>
    )
}
