export interface Course {
  id: string;
  userId: string;
  name: string;
  par: number;
  holes: number;
  createdAt: Date;
}

export interface Round {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  date: Date;
  scores: number[];
  totalScore: number;
  totalPar: number;
  completed: boolean;
}

export interface HoleScore {
  hole: number;
  score: number;
  par: number;
}
