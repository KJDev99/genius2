'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Button from '@/components/ui/Buttom'
import { useApiStore } from '@/store/useApiStore'

export default function Registration() {
  const router = useRouter()
  const { postData, loading } = useApiStore()

  // Foydalanuvchi turi: 'buyer' (Xaridor) yoki 'partner' (Hamkor)
  const [userType, setUserType] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name_company: '', // Hamkor uchun yangi maydon
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirm: '',
    terms_accepted: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    // Hamkor bo'lsa kompaniya nomini tekshirish
    if (userType === 'partner' && !formData.name_company.trim()) {
      toast.error('Введите название компании')
      return false
    }

    if (!formData.first_name.trim()) {
      toast.error('Введите имя')
      return false
    }

    if (!formData.last_name.trim()) {
      toast.error('Введите фамилию')
      return false
    }

    if (!formData.phone.trim()) {
      toast.error('Введите номер телефона')
      return false
    }

    if (!formData.email.trim()) {
      toast.error('Введите email')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Неверный формат email')
      return false
    }

    if (!formData.password) {
      toast.error('Введите пароль')
      return false
    }

    if (formData.password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов')
      return false
    }

    if (formData.password !== formData.password_confirm) {
      toast.error('Пароли не совпадают')
      return false
    }

    if (!formData.terms_accepted) {
      toast.error('Примите условия и положения')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const { terms_accepted, ...apiData } = formData

    // Agar xaridor bo'lsa, name_company ni yubormaslik kerak
    if (userType === 'buyer') {
      delete apiData.name_company
    }

    // URL foydalanuvchi turiga qarab o'zgaradi
    const endpoint = userType === 'buyer'
      ? '/accounts/register/'
      : '/accounts/register-supplier/'

    const result = await postData(endpoint, apiData)

    if (result && !result.error) {
      toast.success('Регистрация успешна! Проверьте email для подтверждения.')

      setFormData({
        name_company: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirm: '',
        terms_accepted: false
      })

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } else {
      if (result?.email) {
        toast.error(result.email[0] || 'Email уже используется')
      } else if (result?.phone) {
        toast.error(result.phone[0] || 'Телефон уже используется')
      } else if (result?.password) {
        toast.error(result.password[0] || 'Некорректный пароль')
      } else {
        toast.error(result?.detail || 'Ошибка регистрации. Попробуйте снова.')
      }
    }
  }

  return (
    <div className='max-w-[581px] mx-auto px-4'>
      <div className="flex justify-between items-center mb-[32px] mt-[50px] md:mt-[79px] max-md:flex-col gap-y-4">
        <h2 className='font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
          Регистрация
        </h2>

        {/* Foydalanuvchi turini tanlash (Tablar) */}
        <div className="flex gap-x-6">
          <button
            type="button"
            onClick={() => setUserType('buyer')}
            className={`transition-all duration-300 ${userType === 'buyer' ? 'text-[#272727] font-medium border-b-2 border-[#C9A76B]' : 'text-[#27272799]'}`}
          >
            Покупатель
          </button>
          <button
            type="button"
            onClick={() => setUserType('partner')}
            className={`transition-all duration-300 ${userType === 'partner' ? 'text-[#272727] font-medium border-b-2 border-[#C9A76B]' : 'text-[#27272799]'}`}
          >
            Партнер (Юр.лицо)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[16px]">

        {/* Agar Partner bo'lsa kompaniya nomi chiqadi */}
        {userType === 'partner' && (
          <div className="animate-in fade-in duration-500">
            <input
              type="text"
              name="name_company"
              value={formData.name_company}
              onChange={handleInputChange}
              placeholder="Название компании"
              className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Ваше имя"
              className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Ваша фамилия"
              className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Номер телефона"
              className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-mail"
              className="w-full px-6 h-[66px] text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-700 rounded-xl outline-none focus:border-[#C9A76B] transition-colors"
              required
            />
          </div>
        </div>

        <p className="font-normal text-[12px] leading-[14px] text-end text-gray-600">
          На почту придет код для подтверждения
        </p>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Введите пароль"
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

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="password_confirm"
            value={formData.password_confirm}
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

        <div className='flex gap-[16px] items-start'>
          <input
            type="checkbox"
            name="terms_accepted"
            checked={formData.terms_accepted}
            onChange={handleInputChange}
            className='w-[30px] h-[30px] accent-[#C9A76B] flex-shrink-0 mt-1 cursor-pointer'
            required
          />
          <p className='font-normal text-[12px] leading-[140%]'>
            Входя в аккаунт или создавая новый, вы соглашаетесь с нашими{' '}
            <Link href="/terms" className="text-[#C9A76B] hover:underline">
              Правилами и условиями
            </Link>
            {' '}и{' '}
            <Link href="/privacy" className="text-[#C9A76B] hover:underline">
              Положением о конфиденциальности
            </Link>
          </p>
        </div>

        <div className='flex justify-between items-center pt-4'>
          <p className='font-normal text-[14px] md:text-[16px] text-[#27272799]'>
            Уже есть аккаунт?
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
          text={loading ? 'Регистрация...' : 'Зарегистрироваться'}
          className={`w-full h-[66px] rounded-[12px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
      </form>
    </div>
  )
}