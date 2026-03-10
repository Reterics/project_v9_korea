import { useMemo } from "react";
import type { StudyItemRef, GameConfig } from "@/features/learn/games/_core/gameTypes";
import { useData } from "@/features/learn/data/DataProvider";

/**
 * Smart item selection: due items first, then unseen, then random fill.
 */
export function useStudySession(totalQuestions: number = 5) {
  const { content, progress } = useData();

  const items = useMemo(() => {
    const now = new Date().getTime();
    const allRefs = content.getAllWordRefs();
    const due = progress.getDueItems(now);
    const allProgress = progress.getAllProgress();
    const seenIds = new Set(allProgress.map((p) => `${p.ref.kind}_${p.ref.id}`));

    // Due items first
    const selected: StudyItemRef[] = due
      .slice(0, totalQuestions)
      .map((p) => p.ref);

    // Then unseen items
    if (selected.length < totalQuestions) {
      const unseen = allRefs.filter((r) => !seenIds.has(`${r.kind}_${r.id}`));
      for (const ref of unseen) {
        if (selected.length >= totalQuestions) break;
        selected.push(ref);
      }
    }

    // Fill remaining randomly from all refs
    if (selected.length < totalQuestions) {
      const selectedIds = new Set(selected.map((r) => `${r.kind}_${r.id}`));
      const remaining = allRefs.filter((r) => !selectedIds.has(`${r.kind}_${r.id}`));
      for (const ref of remaining) {
        if (selected.length >= totalQuestions) break;
        selected.push(ref);
      }
    }

    return selected;
  }, [totalQuestions, content, progress]);

  const config = useMemo<GameConfig>(() => ({ totalQuestions }), [totalQuestions]);

  return { items, config };
}
