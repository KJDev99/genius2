import SupplierOrder from '@/components/Supplier/order/supplier-order'
import SupplierLayout from '@/components/Supplier/SupplierLayout'
import React from 'react'

export default function page() {
    return (
        <SupplierLayout>
            <SupplierOrder />
        </SupplierLayout>
    )
}
