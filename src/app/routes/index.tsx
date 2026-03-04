import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../AppShell";
import { LearnHubPage } from "@/features/learn/LearnHubPage";
import { KnowledgeBasePage } from "@/features/learn/KnowledgeBasePage";
import { GamePlayPage } from "./GamePlayPage";
import { HangeulPracticePage } from "@/features/hangeul/HangeulPracticePage";
import { HangeulPracticeGamePage } from "@/features/hangeul/HangeulPracticeGamePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LearnHubPage /> },
      { path: "notes", element: <KnowledgeBasePage /> },
      { path: "hangeul-practice", element: <HangeulPracticePage /> },
      { path: "hangeul-practice/game", element: <HangeulPracticeGamePage /> },
    ],
  },
  {
    path: "/play/:gameId",
    element: <GamePlayPage />,
  },
]);
