"use client";

import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="h-14 sticky top-0 z-40 flex items-center justify-between border-b bg-background/60 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center gap-3" />
      <div className="flex items-center gap-2">
        <UserButton
          appearance={{ elements: { userButtonBox: "h-8 w-8" } }}
          showName={false}
          afterSignOutUrl="/dashboard/sign-in"
        />
      </div>
    </header>
  );
}
