import SupplierBinance from '@/components/Supplier/binance/supplier-binance'
import SupplierLayout from '@/components/Supplier/SupplierLayout'
import React from 'react'

export default function page() {
    return (
        <SupplierLayout>
            <SupplierBinance />
        </SupplierLayout>
    )
}
