import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Course } from '@/types';

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'courses'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Course[];

      setCourses(coursesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addCourse = async (name: string, par: number, holes: number) => {
    if (!user) return;

    await addDoc(collection(db, 'courses'), {
      userId: user.uid,
      name,
      par,
      holes,
      createdAt: Timestamp.now(),
    });
  };

  const deleteCourse = async (courseId: string) => {
    await deleteDoc(doc(db, 'courses', courseId));
  };

  return { courses, loading, addCourse, deleteCourse };
}
