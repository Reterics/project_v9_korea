import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../AppShell";
import { LearnHubPage } from "@/features/learn/LearnHubPage";
import { KnowledgeBasePage } from "@/features/learn/KnowledgeBasePage";
import { GamePlayPage } from "./GamePlayPage";
import { HangeulPracticePage } from "@/features/hangeul/HangeulPracticePage";
import { HangeulPracticeGamePage } from "@/features/hangeul/HangeulPracticeGamePage";
import { DictionaryPage } from "@/features/learn/DictionaryPage";
import { GrammarPage } from "@/features/learn/grammar/GrammarPage";
import { GrammarLessonPage } from "@/features/learn/grammar/GrammarLessonPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LearnHubPage /> },
      { path: "notes", element: <KnowledgeBasePage /> },
      { path: "hangeul-practice", element: <HangeulPracticePage /> },
      { path: "hangeul-practice/game", element: <HangeulPracticeGamePage /> },
      { path: "dictionary", element: <DictionaryPage /> },
      { path: "grammar", element: <GrammarPage /> },
      { path: "grammar/:lessonId", element: <GrammarLessonPage /> },
    ],
  },
  {
    path: "/play/:gameId",
    element: <GamePlayPage />,
  },
]);
