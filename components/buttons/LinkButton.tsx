import Link from 'next/link'
import React from 'react'

function LinkButton({ to, children }: { to: string, children: any }) {
  return (
    <Link href={to}>
      <a target="_new" className="flex p-2 hover:bg-gray-100 rounded-md">
        {children}
      </a>
    </Link>)
}

export default LinkButton
