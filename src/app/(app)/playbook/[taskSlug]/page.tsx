"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTaskProgress } from "@/lib/hooks/useTaskProgress";
import { HelpPanel } from "@/components/playbook/HelpPanel";
import { StepNav } from "@/components/playbook/StepNav";
import { CompletionAnimation } from "@/components/playbook/CompletionAnimation";
import { NicheEditor } from "@/components/playbook/tasks/NicheEditor";
import { PositioningEditor } from "@/components/playbook/tasks/PositioningEditor";
import { BuyerProfileEditor } from "@/components/playbook/tasks/BuyerProfileEditor";
import { GutCheckEditor } from "@/components/playbook/tasks/GutCheckEditor";
import { WorksheetEditor } from "@/components/playbook/tasks/WorksheetEditor";
import { communityMembershipOperatorConfigs } from "@/lib/worksheetConfigs/community-membership-operator";

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
  quizContext: {
    role: string | null;
    years: string | null;
    companySize: string | null;
    industries: string | null;
    businessModels: string | null;
    shoulderTap: string | null;
    weirdlyGood: string | null;
    managingComfort: string | null;
    workMode: string | null;
    energyDrains: string | null;
    sameOrDifferent: string | null;
    blocker: string | null;
    interests: string | null;
    bestScenario: string | null;
    successGoal: string | null;
    whatToAvoid: string | null;
    incomeTimeline: string | null;
    zeroIncomeImpact: string | null;
    liquidCapital: string | null;
    borrowingComfort: string | null;
    networkContacts: string | null;
    outreachComfort: string | null;
    publicVisibility: string | null;
    weeklyTime: string | null;
    workingConditions: string | null;
    kidsAges: string | null;
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

// Fetch another task's saved data (for cross-task personalization)
function useCrossTaskData(taskType: string) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/playbook/${taskType}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.progress?.savedData) setData(json.progress.savedData);
      })
      .catch(() => {});
  }, [taskType]);

  return data;
}

const saveStatusLabels: Record<string, { text: string; color: string }> = {
  saved: { text: "Saved", color: "text-blair-charcoal/30" },
  saving: { text: "Saving...", color: "text-blair-sage" },
  unsaved: { text: "Unsaved changes", color: "text-amber-500" },
  error: { text: "Save failed", color: "text-red-500" },
};

export default function TaskWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const taskSlug = params.taskSlug as string;
  const [showCompletion, setShowCompletion] = useState(false);
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
  const nicheData = useCrossTaskData("niche-editor");

  // Reset completion overlay when navigating between tasks
  useEffect(() => {
    setShowCompletion(false);
  }, [taskSlug]);

  const handleMarkComplete = useCallback(() => {
    markComplete();
    setShowCompletion(true);
  }, [markComplete]);

  const handleAutoAdvance = useCallback(() => {
    if (nextTask) {
      router.push(`/playbook/${nextTask.slug}`);
    }
  }, [nextTask, router]);

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
    // Check for a worksheet config first (community path + future paths)
    const worksheetConfig = communityMembershipOperatorConfigs[task.slug];
    if (worksheetConfig) {
      return (
        <WorksheetEditor
          config={worksheetConfig}
          savedData={savedData}
          onSave={handleSave}
        />
      );
    }

    // Fall back to legacy service-path editors
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
            nicheData={nicheData}
            quizContext={recommendation?.quizContext || null}
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
              Task {task.order} of {task.totalTasksInPhase || 4}
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
        onMarkComplete={handleMarkComplete}
        onUndoComplete={undoComplete}
        isComplete={isComplete}
      />

      {/* Confetti + quip overlay */}
      <CompletionAnimation
        show={showCompletion}
        isLastTask={!nextTask}
        nextTaskSlug={nextTask?.slug}
        onAutoAdvance={handleAutoAdvance}
      />
    </div>
  );
}
