import React from 'react'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/" className=" font-bold text-gray-900 select-none">insight<span className="text-blue-700">Pilot</span></Link>
  )
}

export default Logo