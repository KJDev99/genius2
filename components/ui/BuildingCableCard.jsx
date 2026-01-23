'use client'
import Image from "next/image";
import Button from "./Buttom";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BuildingCableCard({
  id,
  name,
  description,
  image,
  subCategories
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/catalog-details/${id}`);
  };

  return (
    <div className="rounded-[16px] h-[415px] bg-gradient-to-b from-transparent to-gray-100/80">
      <div className="h-[180px] overflow-hidden rounded-t-[16px] cursor-pointer" onClick={handleClick}>
        {image ? (
          <Image
            className='w-full h-full object-cover'
            src={image}
            height={180}
            width={408}
            alt={name || "Категория"}
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col">
        <h3 className="font-normal text-[24px] leading-[100%] tracking-[-0.04em] mb-2 h-12 cursor-pointer" onClick={handleClick}>
          {name || "Название категории"}
        </h3>
        <p className="font-normal text-[16px] leading-[130%] tracking-[-0.04em] mb-4 line-clamp-3 grow h-[62px]">
          {description || "Описание категории"}
        </p>
        <Button
          className={`relative w-full h-[52px] text-center bg-[#DDDDDD] text-[#272727] 
            transition-all
            hover:bg-[linear-gradient(119.47deg,_#D8C19A_20.35%,_#C3974C_94.16%)]`}
          text={'Перейти в каталог'}
          onClick={handleClick}
        />

      </div>
    </div>
  );
}