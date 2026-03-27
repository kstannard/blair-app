"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTaskProgress } from "@/lib/hooks/useTaskProgress";
import { HelpPanel } from "@/components/playbook/HelpPanel";
import { StepNav } from "@/components/playbook/StepNav";
import { NicheEditor } from "@/components/playbook/tasks/NicheEditor";
import { PositioningEditor } from "@/components/playbook/tasks/PositioningEditor";
import { BuyerProfileEditor } from "@/components/playbook/tasks/BuyerProfileEditor";
import { GutCheckEditor } from "@/components/playbook/tasks/GutCheckEditor";

interface RecommendationData {
  primaryPath: {
    slug: string;
    name: string;
    description: string;
    incomeRangeLow: number;
    incomeRangeHigh: number;
  } | null;
  secondaryPaths: Array<{
    slug: string;
    name: string;
    description: string;
    incomeRangeLow: number;
    incomeRangeHigh: number;
    altDescription: string | null;
    altWhyConsider: string | null;
    altTradeoff: string | null;
  }>;
  personalIntro: string | null;
  personalizedWhy: string | null;
  userProfile: {
    traits: string;
    strengths: string;
    summary: string | null;
    unfairAdvantageEvidence: string | null;
    unfairAdvantageDescription: string | null;
    linkedinSummary: string | null;
    notableExperience: string | null;
  } | null;
}

function useRecommendation() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/playbook/recommendation")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { recommendation: data, recommendationLoading: loading };
}

const saveStatusLabels: Record<string, { text: string; color: string }> = {
  saved: { text: "Saved", color: "text-blair-charcoal/30" },
  saving: { text: "Saving...", color: "text-blair-sage" },
  unsaved: { text: "Unsaved changes", color: "text-amber-500" },
  error: { text: "Save failed", color: "text-red-500" },
};

export default function TaskWorkspacePage() {
  const params = useParams();
  const taskSlug = params.taskSlug as string;
  const {
    task,
    progress,
    previousTask,
    nextTask,
    incompletePreviousTask,
    savedData,
    updateField,
    updateFields,
    saveStatus,
    markComplete,
    undoComplete,
    isLoading,
  } = useTaskProgress(taskSlug);

  const { recommendation } = useRecommendation();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blair-mist border-t-blair-sage" />
          <p className="mt-4 text-sm text-blair-charcoal/40">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!task || !progress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-blair-charcoal/60">
            Task not found.
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = saveStatusLabels[saveStatus] || saveStatusLabels.saved;
  const isComplete = progress.status === "done";

  // Determine the confirmed path slug for task components
  const confirmedPathSlug =
    (savedData.confirmedPathSlug as string) ||
    recommendation?.primaryPath?.slug ||
    "";

  const handleSave = (data: Record<string, unknown>) => {
    updateFields(data);
  };

  const renderTaskContent = () => {
    switch (task.taskType) {
      case "niche-editor":
        return (
          <NicheEditor
            pathSlug={confirmedPathSlug}
            savedData={savedData}
            onSave={handleSave}
            recommendationData={recommendation}
          />
        );
      case "positioning-editor":
        return (
          <PositioningEditor
            pathSlug={confirmedPathSlug}
            userProfile={recommendation?.userProfile || null}
            savedData={savedData}
            onSave={handleSave}
          />
        );
      case "buyer-profile-editor":
        return (
          <BuyerProfileEditor
            pathSlug={confirmedPathSlug}
            savedData={savedData}
            onSave={handleSave}
          />
        );
      case "gut-check":
        return (
          <GutCheckEditor
            pathSlug={confirmedPathSlug}
            savedData={savedData}
            onSave={handleSave}
            pathName={recommendation?.primaryPath?.name || ""}
          />
        );
      default:
        return (
          <div className="rounded-xl border border-blair-mist bg-white p-8 text-center">
            <p className="text-blair-charcoal/60">
              This task type isn't available yet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-blair-sage">
              Task {task.order} of 4
            </p>
            <h1 className="mt-2 font-serif text-2xl text-blair-midnight sm:text-3xl">
              {task.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blair-charcoal/50">
              {task.whyItMatters}
            </p>
          </div>

          {/* Save status */}
          <div className="flex shrink-0 items-center gap-4 pt-1">
            <span className={cn("text-xs font-medium", statusInfo.color)}>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Incomplete previous task warning */}
      {incompletePreviousTask && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <p className="text-sm text-amber-800">
            This task builds on your work in{" "}
            <a href={`/playbook/${incompletePreviousTask.slug}`} className="font-semibold underline hover:text-amber-900">
              {incompletePreviousTask.title}
            </a>
            . You'll get the most out of it if you complete that first.
          </p>
        </div>
      )}

      {/* Two-column layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main workspace */}
        <div className="min-w-0">{renderTaskContent()}</div>

        {/* Help panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <HelpPanel taskType={task.taskType} />
        </div>
      </div>

      {/* Bottom navigation */}
      <StepNav
        previousTask={previousTask}
        nextTask={nextTask}
        onMarkComplete={markComplete}
        onUndoComplete={undoComplete}
        isComplete={isComplete}
      />
    </div>
  );
}
