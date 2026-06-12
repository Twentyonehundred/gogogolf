import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Round } from '@/types';

export function useRounds(courseId?: string) {
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRounds([]);
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'rounds'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    if (courseId) {
      q = query(
        collection(db, 'rounds'),
        where('userId', '==', user.uid),
        where('courseId', '==', courseId),
        orderBy('date', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roundsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Round[];

      setRounds(roundsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, courseId]);

  const startRound = async (courseId: string, courseName: string, totalPar: number, holes: number) => {
    if (!user) return null;

    const docRef = await addDoc(collection(db, 'rounds'), {
      userId: user.uid,
      courseId,
      courseName,
      date: Timestamp.now(),
      scores: Array(holes).fill(0),
      totalScore: 0,
      totalPar,
      completed: false,
    });

    return docRef.id;
  };

  const updateRoundScore = async (roundId: string, holeIndex: number, score: number) => {
    const round = rounds.find(r => r.id === roundId);
    if (!round) return;

    const newScores = [...round.scores];
    newScores[holeIndex] = score;
    const totalScore = newScores.reduce((sum, s) => sum + s, 0);

    await updateDoc(doc(db, 'rounds', roundId), {
      scores: newScores,
      totalScore,
    });
  };

  const completeRound = async (roundId: string) => {
    await updateDoc(doc(db, 'rounds', roundId), {
      completed: true,
    });
  };

  return { rounds, loading, startRound, updateRoundScore, completeRound };
}
