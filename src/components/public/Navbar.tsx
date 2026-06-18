'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { NavTopItem } from '@/lib/nav'

interface NavbarProps {
  logoUrl: string | null
  schoolName: string
  groups?: NavTopItem[]
}

const Navbar = ({ logoUrl, schoolName, groups = [] }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={schoolName}
                width={280}
                height={80}
                className="h-14 w-auto max-w-[240px] object-contain"
                priority
              />
            ) : (
              <span className="text-school-blue font-bold text-lg leading-tight">
                {schoolName}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {groups.map((group) =>
              group.children.length > 0 ? (
                <div key={group.key} className="relative group">
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-school-blue rounded-md flex items-center gap-1"
                    onMouseEnter={() => setOpenDropdown(group.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {group.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === group.key && (
                    <div
                      className="absolute top-full left-0 bg-white shadow-lg rounded-md py-1 min-w-48 z-50"
                      onMouseEnter={() => setOpenDropdown(group.key)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {group.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-school-blue hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={group.key}
                  href={group.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-school-blue rounded-md"
                >
                  {group.label}
                </Link>
              )
            )}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-school-blue"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t">
          {groups.map((group) =>
            group.children.length > 0 ? (
              <div key={group.key}>
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => setOpenDropdown(openDropdown === group.key ? null : group.key)}
                >
                  {group.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={openDropdown === group.key ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                {openDropdown === group.key && (
                  <div className="pl-4 bg-gray-50">
                    {group.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-school-blue"
                        onClick={() => setMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={group.key}
                href={group.href}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-school-blue"
                onClick={() => setMenuOpen(false)}
              >
                {group.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
