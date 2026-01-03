import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Platform Settings
        </h1>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              General Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Configure platform name, branding, and default preferences.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage OAuth providers (Google, GitHub), email settings, and session configuration.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Storage & Media
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Configure Supabase Storage buckets, file size limits, and media policies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Row Level Security policies, rate limiting, and API key management.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              💡 <strong>Next steps:</strong> Implement settings persistence using Supabase tables and environment variable management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
