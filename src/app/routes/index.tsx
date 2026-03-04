import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../AppShell";
import { LearnHubPage } from "@/features/learn/LearnHubPage";
import { GamePlayPage } from "./GamePlayPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LearnHubPage /> },
    ],
  },
  {
    path: "/play/:gameId",
    element: <GamePlayPage />,
  },
]);
