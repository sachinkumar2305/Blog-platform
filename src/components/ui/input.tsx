import React from 'react'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border px-3 py-2 rounded-md bg-transparent outline-none ${props.className || ''}`}
    />
  )
}

export default Input
