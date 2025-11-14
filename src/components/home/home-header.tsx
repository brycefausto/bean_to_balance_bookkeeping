import { auth } from "@/auth"; // path to your Better Auth server instance

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import Link from "next/link";

export default async function HomeHeader() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Coffee className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              Bean to Balance
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          {/* <Link
            href="/pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link> */}
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <ModeToggle />
          {session?.user ? (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
