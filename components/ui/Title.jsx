import React from 'react'

export default function Title({ text, color, size, cls }) {
    return (
        <h2 className={`${cls} ${color ? color : 'text-[#1E1E1E]'} ${size ? size : "text-[32px] uppercase max-md:text-[22px]"}`}>{text}</h2>
    )
}
