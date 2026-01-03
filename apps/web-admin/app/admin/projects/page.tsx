import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProjectsPage() {
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
          Projects Management
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage projects, tasks, and workflows. This section includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>All projects with status indicators</li>
            <li>Task assignments and progress tracking</li>
            <li>Team member assignments</li>
            <li>Project timelines and milestones</li>
            <li>Real-time collaboration updates</li>
          </ul>
          
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              💡 <strong>Next steps:</strong> Connect to projects and tasks tables with RLS policies for team-based access control.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
