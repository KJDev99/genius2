import { Suspense } from 'react'
import ResetPassword from './ResetPassword'

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className='max-w-[581px] m-auto px-4 text-center mt-[177px]'>
                <p className='text-gray-600'>Загрузка...</p>
            </div>
        }>
            <ResetPassword />
        </Suspense>
    )
}