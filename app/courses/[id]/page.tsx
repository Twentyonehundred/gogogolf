'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useRounds } from '@/hooks/useRounds';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { rounds, loading: roundsLoading, startRound } = useRounds(params.id);
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!coursesLoading) {
      const foundCourse = courses.find((c) => c.id === params.id);
      if (foundCourse) {
        setCourse(foundCourse);
      } else if (!coursesLoading) {
        router.push('/courses');
      }
    }
  }, [courses, coursesLoading, params.id, router]);

  const handleStartRound = async () => {
    if (!course) return;
    const roundId = await startRound(course.id, course.name, course.par, course.holes);
    if (roundId) {
      router.push(`/rounds/${roundId}`);
    }
  };

  if (authLoading || coursesLoading || !user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const completedRounds = rounds.filter((r) => r.completed);
  const activeRound = rounds.find((r) => !r.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="text-green-600 hover:text-green-800 text-sm mb-2 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-green-800">{course.name}</h1>
          <p className="text-gray-600">Par {course.par} • {course.holes} holes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeRound ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Round in Progress</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You have an active round. Complete it before starting a new one.
                </p>
              </div>
              <Link
                href={`/rounds/${activeRound.id}`}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Continue Round
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={handleStartRound}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Start New Round
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Round History</h2>
          {roundsLoading ? (
            <p className="text-gray-500">Loading rounds...</p>
          ) : completedRounds.length === 0 ? (
            <p className="text-gray-500">No completed rounds yet.</p>
          ) : (
            <div className="space-y-3">
              {completedRounds.map((round) => {
                const scoreVsPar = round.totalScore - round.totalPar;
                const scoreColor = scoreVsPar === 0 ? 'text-gray-600' : scoreVsPar < 0 ? 'text-green-600' : 'text-red-600';

                return (
                  <Link
                    key={round.id}
                    href={`/rounds/${round.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          {round.date.toLocaleDateString()}
                        </p>
                        <p className="font-semibold text-lg">
                          Score: {round.totalScore}
                          <span className={`ml-2 text-sm ${scoreColor}`}>
                            ({scoreVsPar > 0 ? '+' : ''}{scoreVsPar})
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">vs Par {round.totalPar}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
