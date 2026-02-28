import Link from "next/link"
import { HeartPulse, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <HeartPulse className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                JeevanDhara
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AI-powered medical fundraising platform ensuring transparency and trust in every donation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/apply" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Apply for Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard/public" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Transparency Dashboard
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Donate Now
                </Link>
              </li>
              <li>
                <Link href="/verification" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  AI Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-sm text-muted-foreground">How It Works</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Trust & Safety</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@jeevandhara.org
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +91-1800-123-4567
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            {"JeevanDhara. All rights reserved. A non-profit initiative for transparent medical fundraising."}
          </p>
        </div>
      </div>
    </footer>
  )
}
