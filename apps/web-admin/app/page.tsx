import Link from 'next/link'
import { Database, Users, BarChart3, Settings, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            TradeOS Admin
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Production-ready monorepo with Expo, Next.js, and Supabase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Users Card */}
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Users
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Manage user accounts, roles, and permissions
            </p>
          </Link>

          {/* Analytics Card */}
          <Link
            href="/admin/analytics"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Analytics
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              View platform metrics and usage statistics
            </p>
          </Link>

          {/* Moderation Card */}
          <Link
            href="/admin/moderation"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Moderation
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Content moderation and safety controls
            </p>
          </Link>

          {/* Projects Card */}
          <Link
            href="/admin/projects"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Projects
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Manage projects, tasks, and workflows
            </p>
          </Link>

          {/* Settings Card */}
          <Link
            href="/admin/settings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Settings
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Platform configuration and preferences
            </p>
          </Link>

          {/* Documentation Card */}
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Documentation
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Supabase docs and integration guides
            </p>
          </a>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
              🔒 Security Notice
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Remember to configure your .env.local with actual Supabase credentials.
              Never commit SUPABASE_SERVICE_ROLE_KEY to version control.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
