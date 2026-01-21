import React from 'react'

export default function InputField({ label, type = 'text', full = false }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="text-[#27272799] text-[16px] mb-[12px]">
        {label}
      </p>
      <input
        type={type}
        className={`
          h-[52px] w-[342px]
          md:h-[50px] ${full ? 'md:w-full' : 'md:w-[420px]'}
          rounded-[12px]
          border border-[0.5px] border-[#27272799]
          outline-none px-6
          text-[14px] text-[#272727]
        `}
      />
    </div>
  )
}
