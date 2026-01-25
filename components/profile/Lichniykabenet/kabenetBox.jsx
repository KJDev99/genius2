"use client";

import Button from '@/components/ui/Buttom'; // E'tibor: Buttom → Button deb o'zgartirgan bo'lsangiz yaxshi
import React, { useState, useEffect } from 'react';
import { useApiStore } from '@/store/useApiStore';

export default function KabenetBox() {
    const {
        getDataToken,
        putDataToken,
        loading,
        error
    } = useApiStore();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        postal_code: ''
    });

    const [originalData, setOriginalData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    // Ma'lumotlarni olish
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setInitialLoading(true);
            const response = await getDataToken('/accounts/user/');

            console.log('API Response:', response);

            if (response) {
                const data = {
                    first_name: response.first_name || '',
                    last_name: response.last_name || '',
                    email: response.email || '',
                    phone: response.phone || '',
                    city: response.city || '',
                    street: response.street || '',
                    house: response.house || '',
                    apartment: response.flat || '',     // backend flat deb keladi
                    postal_code: response.index || ''   // backend index deb keladi
                };

                setFormData(data);
                setOriginalData(data); // saqlab qo'yamiz – keyin cancel qilganda qaytish uchun
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        try {
            const requestData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                city: formData.city || null,
                street: formData.street || null,
                house: formData.house || null,
                flat: formData.apartment || null,
                index: formData.postal_code || null
            };

            console.log('Sending data:', requestData);

            const response = await putDataToken('/accounts/user/', requestData);

            if (response) {
                setSuccessMessage('Изменения успешно сохранены!');
                setIsEditing(false);
                setOriginalData({ ...formData }); // yangi holatni original qilib saqlaymiz
                await fetchUserData(); // yangi ma'lumotni serverdan qayta olamiz (xavfsizroq)

                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setSuccessMessage('Ошибка при сохранении изменений');
            }
        } catch (err) {
            console.error('Error updating user data:', err);
            setSuccessMessage('Ошибка при сохранении изменений');
        }
    };

    const handleEditToggle = (e) => {
        e.preventDefault(); // eng muhim qator – forma submit bo‘lmasligi uchun

        if (!isEditing) {
            setIsEditing(true);
            setSuccessMessage('');
        } else {
            // Cancel bosilganda eski ma'lumotlarga qaytamiz
            setFormData({ ...originalData });
            setIsEditing(false);
            setSuccessMessage('');
        }
    };

    if (initialLoading) {
        return (
            <div className='w-[858px] flex justify-center items-center h-64'>
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2">Загрузка данных...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-[858px] mt-[80px] max-md:w-full max-md:mt-8'>
            <h2 className='font-normal text-[24px] leading-[120%] tracking-[-0.04em] mb-[24px] max-md:text-lg max-md:mb-4'>
                Личные данные
            </h2>

            {successMessage && (
                <div className={`mb-4 p-3 rounded-lg ${successMessage.includes('Ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {successMessage}
                </div>
            )}

            {error && !successMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {typeof error === 'string' ? error : 'Произошла ошибка'}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-[16px] max-md:grid-cols-1'>
                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Имя
                        </p>
                        <input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Фамилия
                        </p>
                        <input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Email
                        </p>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="email"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Телефон
                        </p>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="tel"  // phone uchun tel yaxshiroq
                        />
                    </div>
                </div>

                <h2 className='font-normal text-[24px] leading-[120%] tracking-[-0.04em] mb-[24px] mt-[32px] max-md:text-lg max-md:mb-4 max-md:mt-8'>
                    Адрес
                </h2>

                <div className="mb-4">
                    <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                        Город
                    </p>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                        type="text"
                    />
                </div>

                <div className='grid grid-cols-2 gap-[16px] max-md:grid-cols-1'>
                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Улица
                        </p>
                        <input
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Дом
                        </p>
                        <input
                            name="house"
                            value={formData.house}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Квартира
                        </p>
                        <input
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    <div>
                        <p className="text-[#27272799] text-[16px] leading-[18px] tracking-[-0.02em] font-normal mb-[12px]">
                            Индекс
                        </p>
                        <input
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full h-[50px] rounded-[12px] border border-[0.5px] border-[#27272799] outline-none px-6 font-normal text-[14px] leading-[18px] tracking-[0] text-[#272727] disabled:bg-gray-50 disabled:cursor-not-allowed'
                            type="text"
                            inputMode="numeric"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-[48px]">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            disabled={loading}
                            className="w-[200px] h-[67px] rounded-[10px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-[#272727] font-medium hover:opacity-90 transition-opacity max-md:w-full"
                        >
                            Редактировать
                        </button>
                    ) : (
                        <>
                            <Button
                                type="submit"
                                text={loading ? 'Сохранение...' : 'Сохранить изменения'}
                                className="w-[250px] h-[67px] rounded-[10px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-[#272727]"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                disabled={loading}
                                className="w-[150px] h-[67px] rounded-[10px] bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                            >
                                Отмена
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}