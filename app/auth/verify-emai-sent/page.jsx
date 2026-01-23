'use client'

import Link from 'next/link'

export default function VerifyEmailSent() {
    return (
        <div className='max-w-[581px] m-auto px-4 text-center'>
            <div className='mt-[100px] md:mt-[177px]'>
                <div className="mb-8">
                    <svg className="mx-auto w-20 h-20 text-[#C9A76B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className='mb-[24px] font-semibold text-[28px] md:text-[32px] leading-[1.5] tracking-[-0.04em]'>
                    Проверьте вашу почту
                </h2>

                <p className='mb-[16px] text-[16px] text-gray-700'>
                    Мы отправили письмо с подтверждением на указанный email.
                </p>

                <p className='mb-[32px] text-[14px] text-gray-600'>
                    Перейдите по ссылке в письме, чтобы подтвердить вашу регистрацию и завершить процесс.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-[32px]">
                    <p className='text-[14px] text-gray-600 mb-2'>
                        <strong>Не получили письмо?</strong>
                    </p>
                    <p className='text-[13px] text-gray-500'>
                        • Проверьте папку "Спам" или "Промоакции"<br />
                        • Убедитесь, что email указан правильно<br />
                        • Письмо может прийти в течение нескольких минут
                    </p>
                </div>

                <div className='flex flex-col gap-4'>
                    <Link
                        href="/auth/login"
                        className="inline-block px-8 py-3 text-white bg-gradient-to-r from-[#D8C19A] to-[#C3974C] rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Перейти к входу
                    </Link>
                    <Link
                        href="/"
                        className="text-[#C9A76B] hover:underline"
                    >
                        Вернуться на главную
                    </Link>
                </div>
            </div>
        </div>
    )
}