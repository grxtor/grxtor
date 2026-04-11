"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

export function SiteShell({ children, navbar }: { children: React.ReactNode; navbar: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add("admin");
    } else {
      document.body.classList.remove("admin");
    }
    return () => document.body.classList.remove("admin");
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <InteractiveGridPattern
        width={50}
        height={50}
        squares={[40, 40]}
        className="fixed inset-0 h-full w-full -z-10 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,white,transparent)] border-0"
        squaresClassName="stroke-foreground/[0.04] hover:fill-foreground/[0.06] fill-transparent"
      />
      <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
        {children}
      </div>
      {navbar}
      <SmoothCursor />
    </>
  );
}
