import Link from 'next/link'
import { Users, BarChart3, Shield, Database, Settings } from 'lucide-react'

export function Sidebar() {
  const links = [
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/moderation', icon: Shield, label: 'Moderation' },
    { href: '/admin/projects', icon: Database, label: 'Projects' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
