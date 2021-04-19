import Link from "next/link"
import React from "react"

export function HeaderSolid() {
  return (
    <div className="bg-green-600 top-0 inset-x-0 z-100 h-30 items-center hideout background">
      <div className="max-w-7xl mx-auto px-6 sm:px-20">
        <div className="flex py-8 items-center">
          <img src="/images/grail.png"  width="30" className="mr-6"/>
          <Link href="/">
              <a className="w-0 flex-1 text-xl font-mono font-semibold tracking-widest text-white">
                Coding Holy Grail
              </a>
          </Link>
        </div>
      </div>
    </div>
  )
}