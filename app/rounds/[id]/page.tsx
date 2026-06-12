'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRounds } from '@/hooks/useRounds';
import Link from 'next/link';

export default function RoundPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { rounds, loading: roundsLoading, updateRoundScore, completeRound } = useRounds();
  const router = useRouter();
  const [round, setRound] = useState<any>(null);
  const [currentHole, setCurrentHole] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!roundsLoading) {
      const foundRound = rounds.find((r) => r.id === params.id);
      if (foundRound) {
        setRound(foundRound);
        const firstUnscored = foundRound.scores.findIndex((s: number) => s === 0);
        if (firstUnscored !== -1 && !foundRound.completed) {
          setCurrentHole(firstUnscored);
        }
      } else if (!roundsLoading) {
        router.push('/courses');
      }
    }
  }, [rounds, roundsLoading, params.id, router]);

  const handleScoreUpdate = async (holeIndex: number, score: number) => {
    if (!round || score < 1) return;
    await updateRoundScore(round.id, holeIndex, score);
  };

  const handleCompleteRound = async () => {
    if (!round) return;
    const allScored = round.scores.every((s: number) => s > 0);
    if (!allScored) {
      alert('Please score all holes before completing the round.');
      return;
    }
    await completeRound(round.id);
  };

  if (authLoading || roundsLoading || !user || !round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const parPerHole = Math.round(round.totalPar / round.scores.length);
  const totalScore = round.scores.reduce((sum: number, s: number) => sum + s, 0);
  const scoreVsPar = totalScore - round.totalPar;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/courses/${round.courseId}`} className="text-green-600 hover:text-green-800 text-sm mb-2 inline-block">
            ← Back to {round.courseName}
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-green-800">{round.courseName}</h1>
              <p className="text-gray-600">{round.date.toLocaleDateString()}</p>
            </div>
            {round.completed && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Score Summary</h2>
            {!round.completed && (
              <button
                onClick={handleCompleteRound}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Round
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-2xl font-bold">{totalScore || '-'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Par</p>
              <p className="text-2xl font-bold">{round.totalPar}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">vs Par</p>
              <p className={`text-2xl font-bold ${
                scoreVsPar === 0 ? 'text-gray-600' : scoreVsPar < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalScore > 0 ? (scoreVsPar > 0 ? '+' : '') + scoreVsPar : '-'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Holes Completed</p>
              <p className="text-2xl font-bold">
                {round.scores.filter((s: number) => s > 0).length}/{round.scores.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Scorecard</h2>

          {!round.completed && (
            <div className="mb-4 flex gap-2">
              {round.scores.map((_: number, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHole(idx)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentHole === idx
                      ? 'bg-green-600 text-white'
                      : round.scores[idx] > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {round.scores.map((score: number, idx: number) => {
              const holePar = parPerHole;
              const holeScoreVsPar = score > 0 ? score - holePar : 0;

              return (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${
                    currentHole === idx && !round.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16">
                        <p className="text-sm text-gray-600">Hole {idx + 1}</p>
                        <p className="text-xs text-gray-500">Par {holePar}</p>
                      </div>

                      {round.completed ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold">{score}</span>
                          {holeScoreVsPar !== 0 && (
                            <span className={`text-sm ${holeScoreVsPar < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({holeScoreVsPar > 0 ? '+' : ''}{holeScoreVsPar})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleScoreUpdate(idx, num)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                score === num
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {score > 0 && !round.completed && (
                      <button
                        onClick={() => handleScoreUpdate(idx, 0)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {idx < round.scores.length - 1 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Running Total: {round.scores.slice(0, idx + 1).reduce((sum: number, s: number) => sum + s, 0)}
                        {' • '}
                        Through {idx + 1}: {round.scores.slice(0, idx + 1).reduce((sum: number, s: number) => sum + s, 0) - (holePar * (idx + 1)) > 0 ? '+' : ''}
                        {round.scores.slice(0, idx + 1).reduce((sum: number, s: number) => sum + s, 0) - (holePar * (idx + 1))}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
