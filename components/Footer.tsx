import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="space-x-4 py-14 text-gray-500">
      <FooterLink href="http://github.com/dkapanidis">GitHub</FooterLink>
      <FooterLink href="https://www.youtube.com/channel/UCJxmcXMZnBtxzEcjts2y5dA">YouTube</FooterLink>
      <FooterLink  href="https://twitter.com/dkapanidis">Twitter</FooterLink>
    </footer>
  )
}

interface FooterLinkProps { href: string, children: any }
function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link href={href}><a>{children}</a></Link>
  )
}

export default Footer
