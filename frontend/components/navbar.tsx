"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  HeartPulse,
  Menu,
  X,
  Home,
  UserPlus,
  LayoutDashboard,
  Globe,
  ShieldCheck,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/apply", label: "Apply", icon: UserPlus },
  { href: "/dashboard/patient", label: "Patient Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/public", label: "Transparency", icon: Globe },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/payment", label: "Donate", icon: CreditCard },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <HeartPulse className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            JeevanDhara
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/apply">
            <Button variant="outline" size="sm">
              Apply for Support
            </Button>
          </Link>
          <Link href="/payment">
            <Button size="sm">Donate Now</Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <HeartPulse className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">JeevanDhara</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/apply" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Apply for Support
                  </Button>
                </Link>
                <Link href="/payment" onClick={() => setOpen(false)}>
                  <Button className="w-full">Donate Now</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
