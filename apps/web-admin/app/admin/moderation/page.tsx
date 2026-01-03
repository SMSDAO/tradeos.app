import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ModerationPage() {
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
          Content Moderation
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Content moderation and safety controls. Features include:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>Flagged content review queue</li>
            <li>User reports and appeals</li>
            <li>Automated content filtering rules</li>
            <li>Moderation history and audit log</li>
            <li>Block/suspend user actions</li>
          </ul>
          
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              💡 <strong>Next steps:</strong> Implement moderation queues with Supabase triggers and edge functions for automated filtering.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
