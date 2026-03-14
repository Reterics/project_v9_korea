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
import { SettingsPage } from "@/features/settings/SettingsPage";
import { HelpPage } from "@/features/help/HelpPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

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
      { path: "settings", element: <SettingsPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
  {
    path: "/play/:gameId",
    element: <GamePlayPage />,
  },
], { basename });
