import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Bem-vindo {session?.user?.name} 🚀
      </h1>
    </div>
  );
}