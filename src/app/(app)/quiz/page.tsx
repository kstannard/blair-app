import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TYPEFORM_FORM_ID } from "@/lib/typeform-fields";
import { QuizEmbed } from "@/components/quiz/QuizEmbed";

export const metadata = {
  title: "Your Quiz - Blair",
};

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  // If they already have a quiz submission, skip to results
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
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-10 sm:px-10 pt-6">
      <QuizEmbed typeformUrl={typeformUrl.toString()} firstName={firstName} />
    </div>
  );
}
