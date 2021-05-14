import Link from "next/link";
import React from "react";
import { ImTwitter, ImYoutube } from "react-icons/im";

export default function Header() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex pt-6 h-20 pb-4 items-center">
        <Link href="/">
          <a className="flex items-center text-lg font-mono font-semibold tracking-widest text-gray-800 space-x-2">
            <div className="transition transform self-center hover:scale-125">
              <img
                src="/images/grail.png"
                alt="logo"
                width={30}
                height={30}
              />
            </div>
            <span className="hover:text-gray-600">Coding Holy Grail</span>
          </a>
        </Link>

        <div className="flex-grow" />
        <div className="flex text-2xl space-x-1">
          <LinkButton to="https://www.youtube.com/channel/UCJxmcXMZnBtxzEcjts2y5dA">
            <ImYoutube fill="red" />
          </LinkButton>
          <LinkButton to="https://twitter.com/dkapanidis">
            <ImTwitter fill="#1da1f2" />
          </LinkButton>
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
