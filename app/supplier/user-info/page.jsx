import SupplierLayout from '@/components/Supplier/SupplierLayout'
import SupplierUser from '@/components/Supplier/user-info/supplier-user'
import React from 'react'

export default function page() {
    return (
        <SupplierLayout>
            <SupplierUser />
        </SupplierLayout>
    )
}
