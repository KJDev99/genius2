"use client";

import React, { useState, useEffect } from 'react';
import { useApiStore } from '@/store/useApiStore';
import toast from 'react-hot-toast';
import { LuUpload, LuSave, LuChevronDown } from 'react-icons/lu';

export default function SupplierUser() {
    const { getDataToken, putDataToken, postFormDataToken, putFormDataToken, loading } = useApiStore();

    const [companyId, setCompanyId] = useState(null);
    const [formData, setFormData] = useState({
        organizational_legal_form: '',
        abbreviated_name: '',
        full_name: '',
        inn: '',
        ogrn_ogrnip: '',
        kpp: '',
        okpo: '',
        registration_date: '',
        // Юридический адрес
        legal_index: '',
        legal_region: '',
        legal_city: '',
        legal_street: '',
        legal_house: '',
        legal_building: '',
        legal_office: '',
        matches_legal_address: false,
        // Фактический адрес
        actual_index: '',
        actual_region: '',
        actual_city: '',
        actual_street: '',
        actual_house: '',
        actual_building: '',
        actual_office: '',
        // Банковские реквизиты
        bank_name: '',
        bic: '',
        settlement_account: '',
        correspondent_account: '',
        // Контактная информация
        contact_person_full_name: '',
        position: '',
        phone_number: '',
        email: '',
        // Данные руководителя
        director_full_name: '',
        director_position: '',
        acts_on_basis: ''
    });

    const [docs, setDocs] = useState({
        tin_certificate: null,
        ogrn_certificate: null,
        charter: null,
        director_appointment: null
    });

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        const res = await getDataToken('/accounts/company/');
        if (res) {
            setCompanyId(res.id);
            const updatedForm = {};
            Object.keys(formData).forEach(key => {
                updatedForm[key] = res[key] || '';
            });
            updatedForm.matches_legal_address = res.matches_legal_address || false;
            setFormData(updatedForm);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'matches_legal_address') {
            setFormData(prev => ({
                ...prev,
                matches_legal_address: checked,
                ...(checked ? {
                    actual_index: prev.legal_index,
                    actual_region: prev.legal_region,
                    actual_city: prev.legal_city,
                    actual_street: prev.legal_street,
                    actual_house: prev.legal_house,
                    actual_building: prev.legal_building,
                    actual_office: prev.legal_office,
                } : {})
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocs(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!companyId) return;

        // const companyRes = await putDataToken(`/accounts/companies/${companyId}/documents/`, formData);

        const hasFiles = Object.values(docs).some(val => val !== null);
        if (hasFiles) {
            const docData = new FormData();
            Object.keys(docs).forEach(key => {
                if (docs[key]) docData.append(key, docs[key]);
            });
            await postFormDataToken(`/accounts/companies/${companyId}/documents/`, docData);
        }

        // if (companyRes && !companyRes.error) {
        //     toast.success('Данные успешно сохранены');
        //     fetchCompanyData();
        // } else {
        //     toast.error('Ошибка при сохранении');
        // }
    };

    return (
        <div className=" mt-20 max-md:pt-4">
            <form onSubmit={handleSave} className="max-w-[1000px] mx-auto space-y-10 ">

                {/* 1. Основная информация */}
                <section className="space-y-6">
                    <h2 className="text-[20px] text-[#272727]">Основная информация о компании</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-start">
                        <div className="space-y-1">
                            <label className="text-[13px] text-gray-400">Организационно-правовая форма</label>
                            <div className="relative">
                                <select name="organizational_legal_form" value={formData.organizational_legal_form} onChange={handleInputChange} className="w-full h-[54px] border border-gray-200 rounded-xl px-4 appearance-none bg-white outline-none focus:border-[#C9A76B]">
                                    <option value="">Выберите из списка</option>
                                    <option value="OOO">ООО</option>
                                    <option value="IP">ИП</option>
                                </select>
                                <LuChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <Input label="Сокращенное наименование организации" name="abbreviated_name" value={formData.abbreviated_name} onChange={handleInputChange} />
                        <div className="md:col-span-2">
                            <Input label="Полное наименование организации" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                        </div>
                        <Input label="ИНН" name="inn" value={formData.inn} onChange={handleInputChange} placeholder="10 или 12 цифр" />
                        <Input label="ОГРН/ОГРНИП" name="ogrn_ogrnip" value={formData.ogrn_ogrnip} onChange={handleInputChange} placeholder="13 или 15 цифр" />
                        <Input label="КПП" name="kpp" value={formData.kpp} onChange={handleInputChange} placeholder="9 цифр" />
                        <Input label="ОКПО" name="okpo" value={formData.okpo} onChange={handleInputChange} placeholder="8 или 10 цифр" />
                        <Input label="Дата регистрации" name="registration_date" type="date" value={formData.registration_date} onChange={handleInputChange} />
                    </div>
                </section>

                {/* 2. Юридический адрес */}
                <section className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-[20px] text-[#272727]">Юридический адрес</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-start">
                        <Input label="Индекс" name="legal_index" value={formData.legal_index} onChange={handleInputChange} placeholder="6 цифр" />
                        <div className="col-span-1 md:col-span-3">
                            <Input label="Регион/Область" name="legal_region" value={formData.legal_region} onChange={handleInputChange} placeholder="Например: г. Москва" />
                        </div>
                        <div className="col-span-2">
                            <Input label="Город/Населенный пункт" name="legal_city" value={formData.legal_city} onChange={handleInputChange} />
                        </div>
                        <div className="col-span-2">
                            <Input label="Улица" name="legal_street" value={formData.legal_street} onChange={handleInputChange} />
                        </div>
                        <Input label="Дом" name="legal_house" value={formData.legal_house} onChange={handleInputChange} />
                        <Input label="Корпус/Строение" name="legal_building" value={formData.legal_building} onChange={handleInputChange} />
                        <Input label="Офис/Помещение" name="legal_office" value={formData.legal_office} onChange={handleInputChange} />
                    </div>
                </section>

                {/* 3. Фактический адрес */}
                <section className="space-y-6 pt-4 border-t border-gray-100 text-start">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[20px] text-[#272727]">Фактический адрес</h2>
                        <label className="flex items-center gap-2 text-[14px] text-gray-500 cursor-pointer">
                            <input type="checkbox" name="matches_legal_address" checked={formData.matches_legal_address} onChange={handleInputChange} className="w-4 h-4 accent-[#C9A76B]" />
                            Совпадает с юридическим адресом
                        </label>
                    </div>

                    {!formData.matches_legal_address && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                            <Input label="Индекс" name="actual_index" value={formData.actual_index} onChange={handleInputChange} />
                            <div className="col-span-1 md:col-span-3">
                                <Input label="Регион/Область" name="actual_region" value={formData.actual_region} onChange={handleInputChange} />
                            </div>
                            <div className="col-span-2">
                                <Input label="Город/Населенный пункт" name="actual_city" value={formData.actual_city} onChange={handleInputChange} />
                            </div>
                            <div className="col-span-2">
                                <Input label="Улица" name="actual_street" value={formData.actual_street} onChange={handleInputChange} />
                            </div>
                            <Input label="Дом" name="actual_house" value={formData.actual_house} onChange={handleInputChange} />
                            <Input label="Корпус/Строение" name="actual_building" value={formData.actual_building} onChange={handleInputChange} />
                            <Input label="Офис/Помещение" name="actual_office" value={formData.actual_office} onChange={handleInputChange} />
                        </div>
                    )}
                </section>

                {/* 4. Банковские реквизиты */}
                <section className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-[20px] text-[#272727]">Банковские реквизиты</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                        <Input label="Наименование банка" name="bank_name" value={formData.bank_name} onChange={handleInputChange} />
                        <Input label="БИК" name="bic" value={formData.bic} onChange={handleInputChange} placeholder="Например: г. Москва" />
                        <Input label="Расчетный счет" name="settlement_account" value={formData.settlement_account} onChange={handleInputChange} placeholder="20 цифр" />
                        <Input label="Корреспондентский счет" name="correspondent_account" value={formData.correspondent_account} onChange={handleInputChange} placeholder="20 цифр" />
                    </div>
                </section>

                {/* 5. Контактная информация */}
                <section className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-[20px] text-[#272727]">Контактная информация</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                        <Input label="ФИО контактного лица" name="contact_person_full_name" value={formData.contact_person_full_name} onChange={handleInputChange} />
                        <Input label="Должность" name="position" value={formData.position} onChange={handleInputChange} />
                        <Input label="Номер телефона" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="+7 (___) ___-__-__" />
                        <Input label="E-mail" name="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                </section>

                {/* 6. Данные руководителя */}
                <section className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-[20px] text-[#272727]">Данные руководителя</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                        <Input label="ФИО руководителя полностью" name="director_full_name" value={formData.director_full_name} onChange={handleInputChange} placeholder="ФИО" />
                        <Input label="Должность" name="director_position" value={formData.director_position} onChange={handleInputChange} placeholder="Например: Генеральный директор" />
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[13px] text-gray-400">Действует на основании</label>
                            <div className="relative">
                                <select name="acts_on_basis" value={formData.acts_on_basis} onChange={handleInputChange} className="w-full h-[54px] border border-gray-200 rounded-xl px-4 appearance-none bg-white outline-none focus:border-[#C9A76B]">
                                    <option value="">Выберите основания</option>
                                    <option value="ustav">Устава</option>
                                    <option value="doverennost">Доверенности</option>
                                </select>
                                <LuChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Загрузка документов */}
                <section className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-[20px] text-[#272727]">Загрузка документов</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FileSelect label="Свидетельство ИНН" name="tin_certificate" onChange={handleFileChange} fileName={docs.tin_certificate?.name} />
                        <FileSelect label="Свидетельство ОГРН/ОГРНИП" name="ogrn_certificate" onChange={handleFileChange} fileName={docs.ogrn_certificate?.name} />
                        <FileSelect label="Устав (для юр. лиц)" name="charter" onChange={handleFileChange} fileName={docs.charter?.name} />
                        <FileSelect label="Документ о назначении руководителя" name="director_appointment" onChange={handleFileChange} fileName={docs.director_appointment?.name} />
                    </div>
                </section>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-[280px] h-[58px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-white rounded-xl text-[16px] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Reusable Input Component
function Input({ label, name, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div className="space-y-1 flex flex-col">
            <label className="text-[13px] text-gray-400">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-[54px] border border-gray-200 rounded-xl px-4 outline-none focus:border-[#C9A76B] placeholder:text-gray-300 transition-all"
            />
        </div>
    );
}

// Reusable File Component
function FileSelect({ label, name, onChange, fileName }) {
    return (
        <div className="flex flex-col gap-1 text-start">
            <label className="text-[13px] text-gray-400">{label}</label>
            <label className="flex items-center justify-between px-5 h-[54px] border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <span className="text-sm text-gray-400 truncate max-w-[180px]">
                    {fileName || "Файл не выбран"}
                </span>
                <span className="bg-[#EFEFEF] text-[#272727] text-[12px] px-4 py-2 rounded-lg font-medium">
                    Выберите файл
                </span>
                <input type="file" name={name} onChange={onChange} className="hidden" />
            </label>
        </div>
    );
}