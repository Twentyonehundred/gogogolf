'use client';

import { apps } from '@/config/apps';
import { useState } from 'react';

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative">
      {/* Animated grid background */}
      <div className="grid-background" />

      {/* Scan line effect */}
      <div className="scan-line" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            CS
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-indigo-500 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="holo-card group block rounded-xl p-6 iridescent"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-lg ${app.color} flex-shrink-0 icon-glow flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Letter icon */}
                    <span className="text-2xl font-bold text-white relative z-10">
                      {app.icon}
                    </span>
                  </div>

                  {/* Orbiting dot */}
                  {hoveredIndex === index && (
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{
                        animation: 'spin 3s linear infinite',
                      }}
                    >
                      <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium text-gray-100 group-hover:text-white transition-colors mb-1">
                    {app.name}
                  </h2>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {app.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="text-gray-600 group-hover:text-indigo-400 transition-all duration-300 group-hover:translate-x-1">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
