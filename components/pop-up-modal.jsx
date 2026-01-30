'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { PiPaperclipThin } from "react-icons/pi";
import Button from './ui/Buttom';
import { motion } from 'framer-motion';
import { useApiStore } from '@/store/useApiStore';
import toast from 'react-hot-toast';

export default function PopUpModal({ setOpen }) {
  const { postFormDataToken, loading } = useApiStore();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
    privacy_policy_agreed: false
  });
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Пожалуйста, введите имя');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Пожалуйста, введите телефон');
      return;
    }

    if (!formData.privacy_policy_agreed) {
      toast.error('Пожалуйста, согласитесь с политикой конфиденциальности');
      return;
    }

    // Create FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('email', formData.email || '');
    data.append('comment', formData.comment || '');
    data.append('privacy_policy_agreed', formData.privacy_policy_agreed);

    if (file) {
      data.append('file', file);
    }

    // Submit
    const result = await postFormDataToken('/sites/request/', data);

    if (result && !result.error) {
      toast.success('Заявка успешно отправлена!');
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        comment: '',
        privacy_policy_agreed: false
      });
      setFile(null);
      // Close modal after short delay
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } else {
      toast.error('Ошибка при отправке заявки. Попробуйте снова.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setOpen(false)}
    >
      <motion.div
        className='bg-[#FFFFFF] flex max-lg:flex-col gap-[32px] lg:gap-[48px] rounded-[24px] lg:rounded-[32px] max-h-[95vh] overflow-y-auto w-full max-w-[1200px]'
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="hidden lg:block flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/modal.png"
            width={630}
            height={796}
            alt="modalimg"
            className="rounded-l-[32px] h-full object-cover"
          />
        </motion.div>

        <motion.div
          className='flex-1 p-6 lg:pr-12 lg:py-12'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className='flex justify-between items-center mb-6 lg:mb-8'>
            <motion.h2
              className='font-normal text-[24px] lg:text-[32px] leading-[1.3] tracking-[-0.04em]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Оставить заявку
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              <IoCloseOutline size={28} className="lg:text-[32px]" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <input
                className='px-[20px] lg:px-[24px] outline-none w-full h-[56px] lg:h-[67px] rounded-[12px] border-[1px] border-[#27272733] focus:border-[#C9A76B] transition-colors'
                type="text"
                placeholder='Имя *'
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                className='px-[20px] lg:px-[24px] outline-none w-full mt-[16px] lg:mt-[24px] h-[56px] lg:h-[67px] rounded-[12px] border-[1px] border-[#27272733] focus:border-[#C9A76B] transition-colors'
                type="tel"
                placeholder='+7 (___) ___-__-__ *'
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <input
                className='px-[20px] lg:px-[24px] outline-none w-full mt-[16px] lg:mt-[24px] h-[56px] lg:h-[67px] rounded-[12px] border-[1px] border-[#27272733] focus:border-[#C9A76B] transition-colors'
                type="email"
                placeholder='Email'
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <textarea
                className='px-[20px] lg:px-[24px] py-[16px] outline-none w-full mt-[16px] lg:mt-[24px] h-[100px] lg:h-[67px] rounded-[12px] border-[1px] border-[#27272733] focus:border-[#C9A76B] transition-colors resize-none'
                placeholder='Комментарий'
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.p
              className='font-normal text-[14px] lg:text-[18px] leading-[130%] tracking-[-0.04em] text-[#27272799] mt-[12px] lg:mt-[16px]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              Если у вас есть документы для подбора кабеля и расчёта стоимости, прикрепите файл к заявке
            </motion.p>

            <motion.div
              className='flex w-full lg:w-[206px] h-[56px] lg:h-[67px] border border-[#27272733] rounded-[12px] mt-[16px] lg:mt-[24px] justify-center items-center gap-[6px] cursor-pointer hover:border-[#C9A76B] transition-colors'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleFileClick}
            >
              <PiPaperclipThin size={19} />
              <p className='text-sm lg:text-base leading-[1.2] tracking-[-0.02em] text-[#27272780] truncate max-w-[150px]'>
                {file ? file.name : 'Прикрепить файл'}
              </p>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png"
            />

            <motion.label
              className="flex mt-[16px] lg:mt-[24px] items-start lg:items-center gap-3 cursor-pointer text-[#6B6B6B] text-sm lg:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <input
                type="checkbox"
                name="privacy_policy_agreed"
                checked={formData.privacy_policy_agreed}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border border-[#27272733] accent-black focus:ring-0 flex-shrink-0 mt-0.5 lg:mt-0"
              />
              <span>Согласен с <a className='underline' target='_blank' href="">политикой конфиденциальности</a></span>
            </motion.label>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-[56px] lg:h-[78px] bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] mt-[24px] lg:mt-[32px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                text={loading ? 'Отправка...' : 'Оставить заявку'}
              />
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}