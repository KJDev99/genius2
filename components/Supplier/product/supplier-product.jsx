"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    LuPlus, LuTrash2, LuPencil, LuX, LuUpload,
    LuChevronDown, LuMinus, LuSearch,
    LuCircleAlert
} from "react-icons/lu";
import { useApiStore } from '@/store/useApiStore';
import toast from 'react-hot-toast';

export default function SupplierProduct() {
    const {
        getDataToken,
        postFormDataToken,
        putFormDataToken,
        deleteDataToken,
        loading
    } = useApiStore();

    // Sahifa holatlari
    const [products, setProducts] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [selectedMainCat, setSelectedMainCat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });
    // Form ma'lumotlari
    const [formData, setFormData] = useState({
        sub_category: '',
        name: '',
        sku: '',
        description: '',
        price_per_meter: '',
        stock: '',
        manufacturer: '',
        country_of_origin: '',
        number_of_cores: '',
        conductor_material: '',
        cable_cross_section: '',
        outer_insulation_material: '',
        conductor_insulation_material: '',
        outer_sheath_material: '',
        model_version: '',
        color: '',
        is_active: true,
        images: [],
        meterages: '[{"value": 10, "is_active": true}]'
    });

    // Ma'lumotlarni yuklash
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const [prodRes, catRes] = await Promise.all([
            getDataToken('/products/supplier/products/'),
            getDataToken('/products/main-categories/')
        ]);
        if (prodRes?.results) setProducts(prodRes.results);
        if (catRes) setMainCategories(catRes);
    };

    // Input o'zgarishi
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Asosiy kategoriya tanlanganda sub-kategoriyalarni filtrlash
    const handleMainCategoryChange = (e) => {
        const catId = parseInt(e.target.value);
        const category = mainCategories.find(c => c.id === catId);
        setSelectedMainCat(category);
        setFormData(prev => ({ ...prev, sub_category: '' }));
    };

    // Rasmlar bilan ishlash
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 10) {
            return toast.error("Максимум 10 изображений");
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Saqlash (Create / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                // Rasmlarni bitta massiv ko'rinishida emas, 
                // balki har bir faylni alohida 'images' keyi bilan append qilamiz
                formData.images.forEach(file => {
                    data.append('images', file);
                });
            } else if (formData[key] !== '' && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        let res;
        if (editingProduct) {
            res = await putFormDataToken(`/products/supplier/products/${editingProduct.id}/update/`, data);
        } else {
            res = await postFormDataToken('/products/supplier/products/create/', data);
        }

        if (res && !res.error) {
            toast.success(editingProduct ? 'Товар обновлен' : 'Товар создан');
            setIsModalOpen(false);
            resetForm();
            fetchInitialData();
        } else {
            toast.error(res?.sku ? "SKU уже существует" : "Ошибка при сохранении");
        }
    };

    const confirmDelete = async () => {
        const res = await deleteDataToken(`/products/supplier/products/${deleteModal.productId}/delete/`);
        if (res && !res.error) {
            toast.success("Товар удален");
            setDeleteModal({ isOpen: false, productId: null });
            fetchInitialData();
        } else {
            toast.error("Не удалось удалить товар");
        }
    };

    const resetForm = () => {
        setFormData({
            sub_category: '', name: '', sku: '', description: '', price_per_meter: '',
            stock: '', manufacturer: '', country_of_origin: '', number_of_cores: '',
            conductor_material: '', cable_cross_section: '', outer_insulation_material: '',
            conductor_insulation_material: '', outer_sheath_material: '',
            model_version: '', color: '', is_active: true, images: [],
            meterages: '[{"value": 10, "is_active": true}]'
        });
        setEditingProduct(null);
        setSelectedMainCat(null);
    };

    return (
        <div className="mt-20 max-md:pt-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[28px] md:text-[32px] text-[#272727]">
                    Товары <span className="text-gray-400 font-normal text-lg ml-2">{products.length} товаров</span>
                </h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:opacity-90 transition-all"
                >
                    Создать новый товар
                </button>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-md:gap-4">
                {products.map((product) => (
                    <div key={product.id} className="p-4 bg-white rounded-[12px] shadow-sm border border-transparent hover:border-[#C9A76B33] relative group transition-all">
                        <div className="absolute top-4 left-4 z-10 bg-[#F4EDE1] border border-[#C9A76B99] text-[#C9A76B] px-3 py-1 rounded-md text-[10px]">Активен</div>
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 ">
                            <button onClick={() => setDeleteModal({ isOpen: true, productId: product.id })} className="group-hover:text-[#272727] group-hover:bg-[#C3974C] transition-opacity p-2 bg-[#C9A76B33] rounded-[6px] border border-[#C9A76B99] text-[#C9A76B]"><LuTrash2 size={16} /></button>
                        </div>
                        <div className="h-[200px] relative mb-4">
                            <Image src={product.images?.[0]?.image || '/sec.png'} fill className="object-contain" alt="product" />
                        </div>
                        <h4 className="text-gray-400 text-xs mb-1">{product.sku}</h4>
                        <p className="text-[#272727] font-medium text-sm line-clamp-2 mb-3 h-10">{product.name}</p>
                        <div className="text-xl bg-gradient-to-r from-[#D8C19A] to-[#C3974C] bg-clip-text text-transparent">
                            {parseFloat(product.price_per_meter).toLocaleString()} ₽ <span className="text-gray-400 text-sm font-normal">/ шт</span>
                        </div>
                        <button className="w-full mt-4 py-3 bg-[#F5F5F5] text-gray-400 rounded-xl text-sm font-medium hover:bg-[#D8C19A] hover:text-white transition-colors">В корзину</button>
                    </div>
                ))}
            </div>

            {/* FULL MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-[850px] rounded-[32px] p-8 md:p-12 max-h-[90vh] overflow-y-auto relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-gray-400 hover:text-black transition-all">
                            <LuX size={30} />
                        </button>

                        <h2 className="text-[28px] mb-8 text-[#272727]">Загрузить карточку товара</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Kategoriya Tanlash */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Основная категория *</label>
                                    <div className="relative">
                                        <select onChange={handleMainCategoryChange} className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B] appearance-none bg-white">
                                            <option value="">Выберите категорию</option>
                                            {mainCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                        <LuChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Подкатегория *</label>
                                    <div className="relative">
                                        <select
                                            name="sub_category"
                                            value={formData.sub_category}
                                            onChange={handleInputChange}
                                            disabled={!selectedMainCat}
                                            className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B] appearance-none bg-white disabled:bg-gray-50"
                                        >
                                            <option value="">Выберите подкатегорию</option>
                                            {selectedMainCat?.sub_categories?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                        </select>
                                        <LuChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Nom va SKU */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Укажите заголовок товара *</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Название" className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B]" required />
                                    <p className="text-[11px] text-gray-400">Длина заголовка не менее 6 символов</p>
                                </div>
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Дайте артикул товару *</label>
                                    <input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU" className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B]" required />
                                </div>
                            </div>

                            {/* Narx va Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Цена за 1 метр *</label>
                                    <input name="price_per_meter" value={formData.price_per_meter} onChange={handleInputChange} placeholder="0.00" className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B]" required />
                                </div>
                                <div className="space-y-2 text-start">
                                    <label className="text-sm font-medium text-gray-600">Наличие</label>
                                    <div className="relative">
                                        <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="1234" className="w-full h-[56px] border border-gray-200 rounded-xl px-5 outline-none focus:border-[#C9A76B]" />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">шт</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tavsif */}
                            <div className="space-y-2 text-start">
                                <label className="text-sm font-medium text-gray-600">Укажите краткое описание товара</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full h-[120px] border border-gray-200 rounded-xl p-5 outline-none focus:border-[#C9A76B] resize-none" />
                            </div>

                            {/* Rasmlar yuklash */}
                            <div className="space-y-4 text-start">
                                <label className="text-sm font-medium text-gray-600">Добавьте фото товара не более 10</label>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="w-20 h-20 relative rounded-lg border overflow-hidden">
                                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="upload" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"><LuX size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                                <label className="w-full h-[66px] border border-gray-200 rounded-xl flex items-center justify-between px-6 cursor-pointer hover:bg-gray-50 transition-all">
                                    <span className="text-gray-400">Выберите файлы</span>
                                    <span className="text-[#C9A76B] font-semibold">Обзор</span>
                                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[70px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] text-white rounded-2xl text-xl shadow-xl hover:scale-[1.01] transition-all"
                            >
                                {loading ? 'Загрузка...' : editingProduct ? 'Сохранить изменения' : 'Выложить'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-[400px] rounded-[24px] p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <LuCircleAlert size={32} />
                        </div>
                        <h3 className="text-xl mb-2 text-[#272727]">Удалить товар?</h3>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                            Вы уверены, что хотите удалить этот товар? <br /> Bu amalni ortga qaytarib bo'lmaydi.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, productId: null })}
                                className="flex-1 h-12 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-all text-gray-700"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-md shadow-red-200"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}