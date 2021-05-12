import Link from "next/link"
import React from "react"
import { ImTwitter, ImYoutube } from "react-icons/im";

export default function Header() {
  return (
    <div className="top-0 inset-x-0 z-100 h-30 items-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex py-6 items-center">
          <Link href="/">
            <a className="flex flex-grow text-lg font-mono font-semibold tracking-widest text-gray-800">
              <img src="/images/grail.png" width="30" className="mr-6 transition transform hover:scale-125" />
              <span>Coding Holy Grail</span>
            </a>
          </Link>

          <div className="flex-grow" />
          <div className="flex text-2xl gap-1">
            <LinkButton to="https://www.youtube.com/channel/UCJxmcXMZnBtxzEcjts2y5dA">
              <ImYoutube fill="red" />
            </LinkButton>
            <LinkButton to="https://twitter.com/dkapanidis">
              <ImTwitter fill="#1da1f2" />
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkButton({ to, children }: { to: string, children: any }) {
  return (
    <Link href={to}>
      <a rel="nofollow noopener" target="_blank" className="flex p-2 hover:bg-gray-100 rounded-md">
        {children}
      </a>
    </Link>)
}
