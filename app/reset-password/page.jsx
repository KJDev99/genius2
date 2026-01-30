'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '@/components/ui/Buttom'
import { useApiStore } from '@/store/useApiStore'

// 1. Formani alohida komponentga olamiz
function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { postData, loading } = useApiStore()

    const token = searchParams.get('token')

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        new_password: '',
        new_password_confirm: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!token) {
            toast.error('Token topilmadi. Havola noto‘g‘ri.')
            return
        }

        if (formData.new_password.length < 6) {
            toast.error('Parol kamida 6 ta belgidan iborat bo‘lishi kerak')
            return
        }

        if (formData.new_password !== formData.new_password_confirm) {
            toast.error('Parollar bir-biriga mos kelmadi')
            return
        }

        const payload = {
            token: token,
            new_password: formData.new_password,
            new_password_confirm: formData.new_password_confirm
        }

        const result = await postData('/accounts/reset-password/', payload)

        if (result) {
            toast.success('Пароль успешно изменен!')
            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)
        } else {
            toast.error('Ошибка при сбросе пароля. Возможно, токен истек.')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative mb-[16px]">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    placeholder="Новый parol"
                    className="w-full px-6 h-[66px] pr-14 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="relative mb-[32px]">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="new_password_confirm"
                    value={formData.new_password_confirm}
                    onChange={handleInputChange}
                    placeholder="Подтвердите новый parol"
                    className="w-full px-6 h-[66px] pr-14 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={loading || !token}
                text={loading ? 'Сохранение...' : 'Изменить пароль'}
                className={`w-full h-[66px] rounded-[12px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] ${loading || !token ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
        </form>
    )
}

// 2. Asosiy sahifa komponenti
export default function ResetPassword() {
    return (
        <div className='max-w-[581px] m-auto px-4'>
            <h2 className='mb-[32px] mt-[100px] md:mt-[177px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
                Новый пароль
            </h2>

            {/* Suspense o'rovchisi build vaqtida xatolikni oldini oladi */}
            <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
                <ResetPasswordContent />
            </Suspense>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    )
}