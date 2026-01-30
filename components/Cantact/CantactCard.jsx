'use client'

import React, { useEffect, useState } from 'react';
import Button from '../ui/Buttom';
import { useApiStore } from '@/store/useApiStore';

const ContactCard = () => {
  const { getData, loading } = useApiStore();
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      const result = await getData('/sites/contact/');

      if (result?.success && result?.data) {
        setContactData(result.data);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1340px] max-sm:mr-4 max-sm:ml-4 flex justify-center items-center mt-[64px] m-auto min-h-[400px]">
        <p className="text-xl">Загрузка...</p>
      </div>
    );
  }

  if (!contactData) {
    return null;
  }

  return (
    <div className="max-w-[1340px] max-sm:mr-4 max-sm:ml-4 max-sm:flex-col flex gap-[48px] mt-[64px] m-auto">
      <div className="w-[475px] max-sm:w-full">
        <h2 className="font-normal text-[32px] leading-[120%] tracking-[-0.01em] max-sm:text-[24px] mb-[32px]">
          Офис
        </h2>

        {/* Address */}
        <div className="mb-6">
          <p className="font-normal text-[16px] leading-[18px] tracking-[0] text-[#272727] mb-[16px] max-sm:text-[14px] max-sm:mb-[12px]">
            Находится по адрес
          </p>
          <p className="font-normal text-[20px] max-sm:text-[16px] leading-[130%] tracking-[0] mb-[32px]">
            {contactData.full_address || `${contactData.zip_code}, г. ${contactData.city}, ул. ${contactData.street}, д. ${contactData.building_number}, оф. ${contactData.office_number}`}
          </p>
        </div>

        {/* Phone and Email */}
        <div className="flex md:gap-[49px] max-sm:gap-[32px] mb-[32px]">
          <div>
            <p className="font-normal text-[16px] leading-[18px] tracking-[0] text-gray-600 mb-[16px] max-sm:text-[14px] max-sm:mb-[12px]">
              Телефон
            </p>
            <a
              href={`tel:${contactData.phone?.replace(/\s/g, '')}`}
              className="font-normal text-[20px] max-sm:text-[16px] leading-[130%] tracking-[0] hover:text-[#C9A76B] transition-colors"
            >
              {contactData.phone}
            </a>
          </div>
          <div>
            <p className="font-normal text-[16px] leading-[18px] tracking-[0] text-gray-600 mb-[16px] max-sm:text-[14px] max-sm:mb-[12px]">
              E-mail
            </p>
            <a
              href={`mailto:${contactData.email}`}
              className="font-normal text-[20px] max-sm:text-[16px] leading-[130%] tracking-[0] hover:text-[#C9A76B] transition-colors"
            >
              {contactData.email}
            </a>
          </div>
        </div>

        {/* Working Hours and Call Button */}
        <div className="flex justify-between max-sm:flex-col max-sm:gap-[32px]">
          <div>
            <h2 className="font-normal text-[16px] leading-[18px] tracking-[0] text-[#272727] mb-[12px] max-sm:text-[14px]">
              Режим работы
            </h2>
            <p className="font-normal text-[20px] max-sm:text-[16px] leading-[130%] tracking-[0]">
              {contactData.working_hours_weekday}
            </p>
            <p className="font-normal text-[20px] max-sm:text-[16px] leading-[130%] tracking-[0]">
              {contactData.working_hours_weekend}
            </p>
          </div>
          <Button
            className={`bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] w-[230px] max-sm:w-full h-[61px]`}
            text={'Заказать звонок'}
          />
        </div>
      </div>

      {/* Map */}
      <div className="rounded-[16px] overflow-hidden max-sm:w-full grow  contact-map">
        {contactData.map_iframe ? (
          <div
            dangerouslySetInnerHTML={{ __html: contactData.map_iframe }}
            className="w-full h-[366px] contact-map"
          />
        ) : (
          <div className="w-full h-[366px] bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Карта недоступна</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;