"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="
        w-full flex items-center justify-center gap-2
        rounded-2xl px-4 py-2.5
        text-sm font-medium
        bg-red-500 text-white
        transition-all duration-200
        hover:bg-red-600 hover:scale-[1.02]
        active:scale-[0.98]
        shadow-sm hover:shadow-md
      "
    >
      <LogOut className="h-4 w-4" />
      Sair da conta
    </button>
  );
}