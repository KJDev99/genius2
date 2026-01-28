'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useApiStore } from '@/store/useApiStore'
import toast from 'react-hot-toast'
import { LuMailCheck, LuLoader, LuMailX } from 'react-icons/lu'

// 1. Asosiy mantiqiy komponent
function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { getDataToken } = useApiStore()

    const [status, setStatus] = useState('loading') // loading, success, error
    const token = searchParams.get('token')
    const verificationStarted = useRef(false)

    useEffect(() => {
        if (token && !verificationStarted.current) {
            verificationStarted.current = true
            verifyEmail()
        } else if (!token) {
            setStatus('error')
        }
    }, [token])

    const verifyEmail = async () => {
        try {
            const response = await getDataToken(`/accounts/verify-email/?token=${token}`)

            if (response && !response.error) {
                setStatus('success')
                toast.success('Email успешно подтвержден!')
                setTimeout(() => {
                    router.push('/auth/login')
                }, 3000)
            } else {
                setStatus('error')
                toast.error(response?.detail || 'Ошибка при подтверждении email')
            }
        } catch (error) {
            setStatus('error')
            toast.error('Произошла системная ошибка')
        }
    }

    return (
        <div className="max-w-[500px] w-full bg-white p-10 rounded-[32px] shadow-sm text-center border border-gray-100">
            {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="w-16 h-16 text-[#C3974C] animate-spin" />
                    <h2 className="text-2xl font-semibold text-[#272727]">Подтверждение...</h2>
                    <p className="text-gray-500">Пожалуйста, подождите, мы проверяем ваш email.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                        <LuMailCheck size={45} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#272727]">Готово!</h2>
                    <p className="text-gray-600">
                        Ваш email успешно подтвержден. <br />
                        Сейчас вы будете перенаправлены на страницу входа.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="mt-6 w-full h-[56px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-white rounded-xl font-medium"
                    >
                        Войти сейчас
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <LuMailX size={45} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#272727]">Ошибка</h2>
                    <p className="text-gray-600">
                        Ссылка недействительна или срок ее действия истек.
                    </p>
                    <button
                        onClick={() => router.push('/auth/register')}
                        className="mt-6 w-full h-[56px] border border-[#C3974C] text-[#C3974C] rounded-xl font-medium hover:bg-[#FDF9F2] transition-all"
                    >
                        Вернуться к регистрации
                    </button>
                </div>
            )}
        </div>
    )
}

// 2. Asosiy Page komponenti Suspense bilan
export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="w-16 h-16 text-[#C3974C] animate-spin" />
                    <p className="text-gray-500">Загрузка...</p>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    )
}