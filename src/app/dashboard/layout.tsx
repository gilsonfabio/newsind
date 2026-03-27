import SidebarLayout from "@/components/SidebarLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Se não estiver logado → volta para login
  if (!session) {
    redirect("/login");
  }

  // Se estiver logado → carrega o menu lateral + conteúdo da página
  return <SidebarLayout>{children}</SidebarLayout>;
}