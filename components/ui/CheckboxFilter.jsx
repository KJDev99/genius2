"use client";
import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckboxFilter({
  title,
  options,
  selected = [],
  onChange
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll ? options : options.slice(0, 5);

  const handleCheckboxChange = (value, checked) => {
    const newSelected = checked
      ? [...selected, value]
      : selected.filter(item => item !== value);

    onChange(newSelected);
  };

  return (
    <div className="w-[317px] rounded-md border border-gray-300 py-4 px-4 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        <span>{title}</span>
        <motion.span
          variants={{
            open: { rotate: 0 },
            closed: { rotate: -90 },
          }}
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <AiOutlineMinus size={20} /> : <AiOutlinePlus size={20} />}
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2">
              {visibleOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}

              {options.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  {showAll ? 'Скрыть' : `Еще ${options.length - 5}`}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}