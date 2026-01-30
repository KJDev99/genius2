'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Button from '@/components/ui/Buttom'
import { useApiStore } from '@/store/useApiStore'

export default function ForgotPassword() {
    const router = useRouter()
    const { postData, loading } = useApiStore()
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!email.trim()) {
            toast.error('Введите email')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Неверный формат email')
            return
        }

        // Submit
        const result = await postData('/accounts/forgot-password/', { email })

        if (result && !result.error) {
            toast.success('Письмо для сброса пароля отправлено на вашу почту!')

            // Reset email
            setEmail('')

            // Redirect to info page
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)
        } else {
            const errorMessage = result?.email?.[0] ||
                result?.detail ||
                'Ошибка. Попробуйте снова.'
            toast.error(errorMessage)
        }
    }

    return (
        <div className='max-w-[581px] m-auto px-4'>
            <h2 className='mb-[24px] mt-[100px] md:mt-[177px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
                Восстановление пароля
            </h2>

            <p className='mb-[32px] text-[14px] md:text-[16px] text-gray-600'>
                Введите email, который вы использовали при регистрации. Мы отправим вам ссылку для сброса пароля.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-[24px]">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
                        required
                    />
                </div>

                <div className='flex mb-[32px] justify-between items-center flex-wrap gap-2'>
                    <p className='font-normal text-[14px] md:text-[16px] text-[#27272799]'>
                        Вспомнили пароль?
                    </p>
                    <Link
                        href={'/auth/login'}
                        className="font-inter hover:underline font-normal text-[14px] md:text-[16px] bg-gradient-to-r from-[#D8C19A] via-[#D8C19A] to-[#C3974C] bg-clip-text text-transparent"
                    >
                        Войти
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    text={loading ? 'Отправка...' : 'Отправить'}
                    className={`w-full h-[66px] rounded-[12px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
            </form>
        </div>
    )
}