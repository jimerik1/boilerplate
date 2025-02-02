// src/app/dashboard/page.tsx
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { DashboardLayout } from "~/app/_components/layout/dashboard-layout";
import { LatestPost } from "~/app/_components/post";

export default async function Dashboard() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/");
  }

  return (
    <DashboardLayout session={session}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user.name}!
          </h2>
          <p className="text-gray-500 dark:text-white">
          </p>
        </div>
        
        <div className="mt-6">
          <LatestPost />
        </div>
      </div>
    </DashboardLayout>
  );
}