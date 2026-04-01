import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TYPEFORM_FORM_ID } from "@/lib/typeform-fields";

export const metadata = {
  title: "Your Quiz - Blair",
};

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  // If they already have a quiz submission or approved recommendation, skip to results
  const existingSubmission = await prisma.quizSubmission.findFirst({
    where: { userId: session.user.id },
  });

  if (existingSubmission) {
    redirect("/results");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const firstName = user?.name?.split(" ")[0] || "";

  // Build Typeform URL with hidden fields
  const typeformUrl = new URL(`https://a0pt7epebii.typeform.com/to/${TYPEFORM_FORM_ID}`);
  if (user?.email) typeformUrl.searchParams.set("email", user.email);
  if (firstName) typeformUrl.searchParams.set("name", firstName);

  return (
    <div className="flex min-h-screen flex-col bg-blair-linen">
      <div className="px-6 pt-6 pb-2 sm:px-10">
        <span className="font-serif text-xl text-blair-midnight tracking-tight">
          blair
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-10 sm:px-10">
        <div className="pt-10 pb-6 text-center">
          <h1 className="font-serif text-3xl text-blair-midnight">
            {firstName ? `${firstName}, let\u2019s build your plan` : "Let\u2019s build your plan"}
          </h1>
          <p className="mt-3 text-base text-blair-charcoal/60">
            This takes about 7 minutes. Your answers shape everything: your
            matched business path, your pricing, and your step-by-step playbook.
          </p>
        </div>

        <div className="rounded-2xl border border-blair-mist bg-white overflow-hidden shadow-sm" style={{ height: "700px" }}>
          <iframe
            src={typeformUrl.toString()}
            className="h-full w-full border-0"
            allow="camera; microphone; autoplay; encrypted-media;"
            title="Blair Quiz"
          />
        </div>

        <p className="mt-4 text-center text-xs text-blair-charcoal/30">
          After you submit, we will review your answers and build your
          personalized plan. You will get an email when it is ready.
        </p>
      </div>
    </div>
  );
}
