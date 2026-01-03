import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function UsersPage() {
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
          User Management
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage user accounts, roles, and permissions. This page will display:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>List of all registered users</li>
            <li>User roles (admin, user)</li>
            <li>Account status (active, suspended)</li>
            <li>Last login timestamps</li>
            <li>User actions (edit, suspend, delete)</li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Next steps:</strong> Integrate with Supabase to fetch real user data from the <code>users</code> table with RLS policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
