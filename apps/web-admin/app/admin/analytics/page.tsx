import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AnalyticsPage() {
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
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages Today</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View platform metrics and usage statistics. This dashboard will show:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>User growth over time</li>
            <li>Active sessions and engagement metrics</li>
            <li>Project and task completion rates</li>
            <li>Storage usage and bandwidth</li>
            <li>Real-time activity feed</li>
          </ul>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded">
            <p className="text-sm text-green-800 dark:text-green-200">
              💡 <strong>Next steps:</strong> Implement analytics queries using Supabase functions and integrate with Supabase Realtime for live updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
