'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApiStore } from '@/store/useApiStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LogOut({ redirtUrl = "/", setExitModalOpen }) {
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const router = useRouter()
    const { postDataToken } = useApiStore()

    const clearLocalStorage = () => {
        try {
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        } catch (error) {
            console.error('LocalStorage dan o\'chirishda xatolik:', error)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        toast.success('Вы успешно вышли из системы!')
        clearLocalStorage()
        window.dispatchEvent(new Event("authChanged"))
        setTimeout(() => {
            router.push('/')
        }, 1000)

    }

    const handleCancel = () => {
        setIsVisible(false)
        if (setExitModalOpen) {
            setExitModalOpen(false)
        }

    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel()
        }
    }



    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-[1010] p-4"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.3
                        }}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                Выход из системы
                            </h3>
                            <p className="text-gray-600">
                                Вы уверены, что хотите выйти из своей учетной записи?
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {/* Oddiy button elementlari */}
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 h-12 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="flex-1 h-12 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Выход...' : 'Выйти'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}