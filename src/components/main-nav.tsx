// src/components/main-nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar} from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800">
  <div className="flex h-16 items-center px-8">
    {/* Left side (Logo) */}
    <div className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/zone-logo.png" alt="Logo" className="h-12 w-12" />
        <span className="text-xl font-bold">Zoneway</span>
      </Link>
    </div>

    {/* Right side (Nav Links) */}
    <div className="flex space-x-4 ml-auto">
      <Button
        variant="ghost"
        asChild
        className={pathname === "/" ? "bg-gray-800" : ""}
      >
        <Link href="/" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Reports</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={pathname === "/holidays" ? "bg-gray-800" : ""}
      >
        <Link href="/holidays" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Holidays</span>
        </Link>
      </Button>
    </div>
  </div>
</nav>

  );
}