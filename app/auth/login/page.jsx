'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import Button from '@/components/ui/Buttom'
import { useApiStore } from '@/store/useApiStore'

export default function Login() {
  const router = useRouter()
  const { postData, loading } = useApiStore()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email_or_phone: '',
    password: ''
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

    if (!formData.email_or_phone.trim()) {
      toast.error('Введите email или телефон')
      return
    }

    if (!formData.password) {
      toast.error('Введите пароль')
      return
    }

    const result = await postData('/accounts/login/', formData)
    console.log(result.message);

    if (result.tokens) {

      localStorage.setItem('access_token', result.tokens.access)
      localStorage.setItem('refresh_token', result.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(result.user))
      toast.success('Вход выполнен успешно!')
      setTimeout(() => {
        router.push('/')
      }, 1000)

    } else {
      console.log('asd');
      toast.error('Неверный email/телефон или пароль')
    }
  }

  return (
    <div className='max-w-[581px] m-auto px-4'>
      <h2 className='mb-[32px] mt-[100px] md:mt-[177px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
        Вход
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-[16px]">
          <input
            type="text"
            name="email_or_phone"
            value={formData.email_or_phone}
            onChange={handleInputChange}
            placeholder="Email или телефон"
            className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
            required
          />
        </div>

        <div className="relative mb-[24px]">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Пароль"
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

        <div className='mb-[16px]'>
          <Link
            href={'/auth/forgot-password'}
            className="font-normal text-[14px] text-[#27272799] hover:text-[#C9A76B] transition-colors"
          >
            Забыли пароль?
          </Link>
        </div>

        <div className='flex mb-[32px] justify-between items-center flex-wrap gap-2'>
          <p className='font-normal text-[14px] md:text-[16px] leading-[120%] tracking-[-0.02em] text-[#27272799]'>
            У вас еще нет аккаунта?
          </p>
          <Link
            href={'/auth/registration'}
            className="font-inter hover:underline font-normal text-[14px] md:text-[16px] leading-[120%] tracking-[-0.02em] bg-gradient-to-r from-[#D8C19A] via-[#D8C19A] to-[#C3974C] bg-clip-text text-transparent"
          >
            Зарегистрироваться
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          text={loading ? 'Вход...' : 'Войти'}
          className={`w-full h-[66px] rounded-[12px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
      </form>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}