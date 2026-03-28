import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskSlug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskSlug } = await params;

  // Get user's confirmed path
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: session.user.id, status: "approved" },
    orderBy: { createdAt: "desc" },
  });

  const confirmedPathId =
    recommendation?.confirmedPathId || recommendation?.primaryPathId;

  // Find the task by slug, scoped to the user's confirmed path.
  // Also supports lookup by taskType (e.g., "buyer-profile-editor") as a fallback.
  let task = await prisma.task.findFirst({
    where: {
      slug: taskSlug,
      ...(confirmedPathId ? { phase: { businessPathId: confirmedPathId } } : {}),
    },
    include: { phase: true },
  });

  // Fallback: try matching by taskType (for cross-task data lookups)
  if (!task && confirmedPathId) {
    task = await prisma.task.findFirst({
      where: {
        taskType: taskSlug,
        phase: { businessPathId: confirmedPathId },
      },
      include: { phase: true },
    });
  }

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Get or create progress
  let progress = await prisma.taskProgress.findUnique({
    where: {
      userId_taskId: {
        userId: session.user.id,
        taskId: task.id,
      },
    },
  });

  if (!progress) {
    progress = await prisma.taskProgress.create({
      data: {
        userId: session.user.id,
        taskId: task.id,
        status: "not_started",
      },
    });
  }

  // Get sibling tasks for prev/next navigation
  const siblingTasks = await prisma.task.findMany({
    where: { phaseId: task.phaseId },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, order: true },
  });

  const currentIndex = siblingTasks.findIndex((t) => t.slug === taskSlug);
  const previousTask =
    currentIndex > 0
      ? { slug: siblingTasks[currentIndex - 1].slug, title: siblingTasks[currentIndex - 1].title }
      : null;
  const nextTask =
    currentIndex < siblingTasks.length - 1
      ? { slug: siblingTasks[currentIndex + 1].slug, title: siblingTasks[currentIndex + 1].title }
      : null;

  // Check if all previous tasks are complete (for the soft warning banner)
  let incompletePreviousTask: { slug: string; title: string } | null = null;
  if (currentIndex > 0) {
    const previousTaskSlugs = siblingTasks.slice(0, currentIndex);
    for (const prevTask of previousTaskSlugs) {
      const prevFullTask = await prisma.task.findFirst({
        where: { slug: prevTask.slug, phaseId: task.phaseId },
      });
      if (prevFullTask) {
        const prevProgress = await prisma.taskProgress.findUnique({
          where: {
            userId_taskId: {
              userId: session.user.id,
              taskId: prevFullTask.id,
            },
          },
        });
        if (!prevProgress || prevProgress.status !== "done") {
          incompletePreviousTask = { slug: prevTask.slug, title: prevTask.title };
          break;
        }
      }
    }
  }

  return NextResponse.json({
    task: {
      id: task.id,
      slug: task.slug,
      title: task.title,
      description: task.description,
      whyItMatters: task.whyItMatters,
      order: task.order,
      taskType: task.taskType,
      timeEstimate: task.timeEstimate,
      phaseId: task.phaseId,
      totalTasksInPhase: siblingTasks.length,
    },
    progress: {
      id: progress.id,
      status: progress.status,
      savedData: progress.savedData ? JSON.parse(progress.savedData) : {},
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
    },
    previousTask,
    nextTask,
    incompletePreviousTask,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskSlug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskSlug } = await params;
  const body = await request.json();

  // Get user's confirmed path
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId: session.user.id, status: "approved" },
    orderBy: { createdAt: "desc" },
  });

  const confirmedPathId =
    recommendation?.confirmedPathId || recommendation?.primaryPathId;

  const task = await prisma.task.findFirst({
    where: {
      slug: taskSlug,
      ...(confirmedPathId ? { phase: { businessPathId: confirmedPathId } } : {}),
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Build update data
  const updateData: Record<string, unknown> = {};

  if (body.savedData !== undefined) {
    updateData.savedData = JSON.stringify(body.savedData);
  }

  if (body.status !== undefined) {
    updateData.status = body.status;

    if (body.status === "done") {
      updateData.completedAt = new Date();
    } else if (body.status === "in_progress") {
      updateData.completedAt = null;
    }
  }

  // Get existing progress to check if we need to set startedAt
  const existing = await prisma.taskProgress.findUnique({
    where: {
      userId_taskId: {
        userId: session.user.id,
        taskId: task.id,
      },
    },
  });

  // Set startedAt on first edit if not already set
  if (existing && !existing.startedAt) {
    updateData.startedAt = new Date();
    if (!body.status || body.status !== "done") {
      updateData.status = "in_progress";
    }
  }

  const progress = await prisma.taskProgress.upsert({
    where: {
      userId_taskId: {
        userId: session.user.id,
        taskId: task.id,
      },
    },
    update: updateData,
    create: {
      userId: session.user.id,
      taskId: task.id,
      status: (updateData.status as string) || "in_progress",
      savedData: (updateData.savedData as string) || "{}",
      startedAt: new Date(),
    },
  });

  return NextResponse.json({
    progress: {
      id: progress.id,
      status: progress.status,
      savedData: progress.savedData ? JSON.parse(progress.savedData) : {},
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
    },
  });
}
