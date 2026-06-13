import { apps } from '@/config/apps';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light text-gray-900 mb-12">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${app.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                    {app.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
