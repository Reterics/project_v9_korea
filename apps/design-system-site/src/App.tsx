import { Routes, Route } from "react-router-dom";
import { DocShell } from "./components/DocShell.tsx";
import { OverviewPage } from "./pages/OverviewPage.tsx";
import { PrinciplesPage } from "./pages/PrinciplesPage.tsx";
import { FoundationsPage } from "./pages/FoundationsPage.tsx";
import { ComponentsPage } from "./pages/ComponentsPage.tsx";
import { PatternsPage } from "./pages/PatternsPage.tsx";
import { BrandPage } from "./pages/BrandPage.tsx";
import { StorybookPage } from "./pages/StorybookPage.tsx";
import { ResourcesPage } from "./pages/ResourcesPage.tsx";

export function App() {
  return (
    <DocShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/principles" element={<PrinciplesPage />} />
        <Route path="/foundations" element={<FoundationsPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/patterns" element={<PatternsPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/storybook" element={<StorybookPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </DocShell>
  );
}
