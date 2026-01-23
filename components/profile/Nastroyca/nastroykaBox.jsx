import Button from '@/components/ui/Buttom'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useApiStore } from '@/store/useApiStore'
import toast, { Toaster } from 'react-hot-toast'



export default function NastroykaBox() {
  const { postDataToken, loading } = useApiStore()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })
  const [errors, setErrors] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))

    // Xatoliklarni tozalash
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    }

    if (!passwordData.old_password.trim()) {
      newErrors.old_password = 'Введите текущий пароль'
      isValid = false
    }

    if (!passwordData.new_password.trim()) {
      newErrors.new_password = 'Введите новый пароль'
      isValid = false
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Пароль должен быть не менее 8 символов'
      isValid = false
    }

    if (!passwordData.new_password_confirm.trim()) {
      newErrors.new_password_confirm = 'Подтвердите новый пароль'
      isValid = false
    } else if (passwordData.new_password !== passwordData.new_password_confirm) {
      newErrors.new_password_confirm = 'Пароли не совпадают'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await postDataToken('/accounts/change-password/', passwordData)
      console.log(response);

      if (response.message == 'Пароль успешно изменен') {
        toast.success('Пароль успешно изменен!')
        // Formani tozalash
        setPasswordData({
          old_password: '',
          new_password: '',
          new_password_confirm: ''
        })
        setShowPasswordForm(false)
        setErrors({
          old_password: '',
          new_password: '',
          new_password_confirm: ''
        })
      } else {
        // Backend xatoliklarini qayta ishlash
        const errorMessage = response?.data?.detail ||
          response?.data?.old_password?.[0] ||
          response?.data?.new_password?.[0] ||
          'Произошла ошибка при изменении пароля'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('Произошла ошибка при изменении пароля')
    }
  }

  const handleCancel = () => {
    setShowPasswordForm(false)
    setPasswordData({
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    })
    setErrors({
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    })
  }

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />

      <h2 className="font-normal text-[24px] leading-[120%] tracking-[-0.04em] mb-[32px]">
        Настройки
      </h2>

      <p className='font-normal text-[18px] leading-[18px] tracking-[-0.01em] mb-[16px]'>
        Безопасность
      </p>

      {!showPasswordForm ? (
        <Button
          text={'Изменить пароль'}
          className={`w-[205px] h-[64px] rounded-[12px] font-normal text-[14px] leading-[16px] tracking-[0em] bg-[#DFDFDF] hover:bg-gray-300 transition-colors`}
          onClick={() => setShowPasswordForm(true)}
        />
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[#27272799] text-[14px] mb-2">
              Текущий пароль
            </label>
            <input
              type="password"
              name="old_password"
              value={passwordData.old_password}
              onChange={handlePasswordChange}
              className={`w-full h-[50px] rounded-[12px] border ${errors.old_password ? 'border-red-500' : 'border-[#27272799]'} outline-none px-4 font-normal text-[14px]`}
              placeholder="Введите текущий пароль"
            />
            {errors.old_password && (
              <p className="text-red-500 text-sm mt-1">{errors.old_password}</p>
            )}
          </div>

          <div>
            <label className="block text-[#27272799] text-[14px] mb-2">
              Новый пароль
            </label>
            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              className={`w-full h-[50px] rounded-[12px] border ${errors.new_password ? 'border-red-500' : 'border-[#27272799]'} outline-none px-4 font-normal text-[14px]`}
              placeholder="Введите новый пароль (минимум 8 символов)"
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
            )}
          </div>

          <div>
            <label className="block text-[#27272799] text-[14px] mb-2">
              Подтвердите новый пароль
            </label>
            <input
              type="password"
              name="new_password_confirm"
              value={passwordData.new_password_confirm}
              onChange={handlePasswordChange}
              className={`w-full h-[50px] rounded-[12px] border ${errors.new_password_confirm ? 'border-red-500' : 'border-[#27272799]'} outline-none px-4 font-normal text-[14px]`}
              placeholder="Повторите новый пароль"
            />
            {errors.new_password_confirm && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password_confirm}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              text={loading ? 'Сохранение...' : 'Сохранить пароль'}
              className={`w-[180px] h-[64px] rounded-[12px] font-normal text-[14px] bg-[linear-gradient(119.47deg,_#D8C19A_20.35%,_#C3974C_94.16%)] hover:opacity-90 transition-opacity`}
              disabled={loading}
            />
            <Button
              type="button"
              text={'Отмена'}
              className={`w-[120px] h-[64px] rounded-[12px] font-normal text-[14px] bg-[#DFDFDF] hover:bg-gray-300 transition-colors`}
              onClick={handleCancel}
              disabled={loading}
            />
          </div>
        </form>
      )}
    </div>
  )
}