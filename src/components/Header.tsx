'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-white">
      <Link href="/" className="font-bold text-xl">
        SlackGauntlet
      </Link>
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
} 