import { JSX } from "react";

export interface CompletedQuestion {
  challengeId: number;
  questionId: number;
  challengeTitle: string;
  totalQuestions: number;
}

export interface TimeSpent {
  challengeId: number;
  questionId: number;
  time: number;
}

export interface ChallengeState {
  completedQuestions: CompletedQuestion[];
  timeSpent: TimeSpent[];
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export interface CompletedChallenge {
  id: number;
  title: string;
  totalTime: number;
}

export interface Challenge {
  id: number;
  challenge: string;
  language: { id: number; name: string };
  level: "EASY" | "MEDIUM" | "HARD";
  questions: any[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface ProtectedRouteProps {
  element: JSX.Element;
  isAuthenticated: boolean;
}

