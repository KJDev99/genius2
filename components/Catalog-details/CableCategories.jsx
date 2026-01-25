"use client";
import { useCatalogStore } from '@/store/catalogStore';

export default function CableCategories() {
  const {
    categories,
    mainCategoryId,
    selectedSubCategory,
    setSelectedSubCategory,
  } = useCatalogStore();

  // Hozirgi kategoriyani topish
  const currentCategory = categories.find(cat => cat.id === mainCategoryId);
  const subCategories = currentCategory?.sub_categories || [];

  if (subCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex md:flex-wrap gap-3 max-md:overflow-x-auto pb-4">
      {subCategories.map((subCat, index) => (
        <button
          key={subCat.id}
          onClick={() => setSelectedSubCategory(subCat.id)}
          className={`px-5 py-2 rounded-[12px] border text-sm transition-all max-md:shrink-0 max-md:h-[50px]
            ${selectedSubCategory === subCat.id
              ? "bg-[linear-gradient(119.47deg,#D8C19A_20.35%,#C3974C_94.16%)] border-[#E6C38B] text-white"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#E6C38B]"
            }
          `}
        >
          {subCat.name}
        </button>
      ))}
    </div>
  );
}