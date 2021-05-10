import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="py-14 space-y-4 relative">
      <div className="space-x-12 text-sm text-gray-500 font-bold text-center">
        <FooterLink href="https://twitter.com/dkapanidis">Twitter</FooterLink>
        <FooterLink href="http://github.com/dkapanidis">GitHub</FooterLink>
        <FooterLink href="https://www.youtube.com/channel/UCJxmcXMZnBtxzEcjts2y5dA">YouTube</FooterLink>
        <FooterLink href="https://www.linkedin.com/in/kapanidis/">LinkedIn</FooterLink>
      </div>
      <div className="space-x-4 text-xs text-gray-400 text-center">
        <FooterLink href="/rss/feed.xml">RSS Feed</FooterLink>
        <FooterLink href="/rss/atom.xml">Atom Feed</FooterLink>
        <FooterLink href="/rss/feed.json">JSON Feed</FooterLink>
      </div>
      <div className="space-x-4 text-xs text-gray-400 text-center absolute right-7 bottom-7">
        Theme inspired by <a target="_new" className="underline" href="https://midu.dev">midu.dev</a>
      </div>
    </footer>
  )
}

interface FooterLinkProps { href: string, children: any }
function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link href={href}><a target="_new">{children}</a></Link>
  )
}

export default Footer
