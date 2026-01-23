'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Buttom'
import { useApiStore } from '@/store/useApiStore'

export default function ResetPassword() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { postData, loading } = useApiStore()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [token, setToken] = useState('')
    const [formData, setFormData] = useState({
        new_password: '',
        new_password_confirm: ''
    })

    useEffect(() => {
        // Get token from URL query params
        const tokenFromUrl = searchParams.get('token')
        if (tokenFromUrl) {
            setToken(tokenFromUrl)
        } else {
            toast.error('Недействительная ссылка для сброса пароля')
            setTimeout(() => {
                router.push('/auth/forgot-password')
            }, 2000)
        }
    }, [searchParams, router])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.new_password) {
            toast.error('Введите новый пароль')
            return
        }

        if (formData.new_password.length < 8) {
            toast.error('Пароль должен содержать минимум 8 символов')
            return
        }

        if (formData.new_password !== formData.new_password_confirm) {
            toast.error('Пароли не совпадают')
            return
        }

        // Submit
        const result = await postData('/accounts/reset-password/', {
            token,
            ...formData
        })

        if (result && !result.error) {
            toast.success('Пароль успешно изменен!')

            // Redirect to login
            setTimeout(() => {
                router.push('/auth/login')
            }, 1500)
        } else {
            const errorMessage = result?.token?.[0] ||
                result?.new_password?.[0] ||
                result?.detail ||
                'Ошибка при сбросе пароля. Попробуйте снова.'
            toast.error(errorMessage)
        }
    }

    if (!token) {
        return (
            <div className='max-w-[581px] m-auto px-4 text-center mt-[177px]'>
                <p className='text-gray-600'>Загрузка...</p>
            </div>
        )
    }

    return (
        <div className='max-w-[581px] m-auto px-4'>
            <h2 className='mb-[24px] mt-[100px] md:mt-[177px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
                Новый пароль
            </h2>

            <p className='mb-[32px] text-[14px] md:text-[16px] text-gray-600'>
                Введите новый пароль для вашего аккаунта
            </p>

            <form onSubmit={handleSubmit}>
                <div className="relative mb-[16px]">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        placeholder="Новый пароль"
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
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="new_password_confirm"
                        value={formData.new_password_confirm}
                        onChange={handleInputChange}
                        placeholder="Повторите пароль"
                        className="w-full px-6 h-[66px] pr-14 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    text={loading ? 'Сохранение...' : 'Сохранить пароль'}
                    className={`w-full h-[66px] rounded-[12px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
            </form>
        </div>
    )
}


// 'use client'

// import Link from 'next/link'

// export default function ResetPasswordSent() {
//   return (
//     <div className='max-w-[581px] m-auto px-4 text-center'>
//       <div className='mt-[100px] md:mt-[177px]'>
//         <div className="mb-8">
//           <svg className="mx-auto w-20 h-20 text-[#C9A76B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//         </div>
        
//         <h2 className='mb-[24px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
//           Проверьте вашу почту
//         </h2>
        
//         <p className='mb-[16px] text-[16px] text-gray-700'>
//           Мы отправили вам письмо с инструкциями по восстановлению пароля.
//         </p>
        
//         <p className='mb-[32px] text-[14px] text-gray-600'>
//           Перейдите по ссылке в письме, чтобы создать новый пароль.
//         </p>

//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-[32px]">
//           <p className='text-[14px] text-gray-600 mb-2'>
//             <strong>Не получили письмо?</strong>
//           </p>
//           <p className='text-[13px] text-gray-500'>
//             • Проверьте папку "Спам" или "Промоакции"<br/>
//             • Убедитесь, что email указан правильно<br/>
//             • Письмо может прийти в течение нескольких минут
//           </p>
//         </div>

//         <div className='flex flex-col gap-4'>
//           <Link
//             href="/auth/forgot-password"
//             className="inline-block px-8 py-3 text-white bg-gradient-to-r from-[#D8C19A] to-[#C3974C] rounded-xl hover:opacity-90 transition-opacity"
//           >
//             Отправить письмо еще раз
//           </Link>
//           <Link
//             href="/auth/login"
//             className="text-[#C9A76B] hover:underline"
//           >
//             Вернуться к входу
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }