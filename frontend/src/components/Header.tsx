import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cases", label: "Verified Cases" },
  { to: "/transparency", label: "Transparency" },
  { to: "/admin", label: "Admin" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
            <img src="/logo.jpeg" alt="JeevanDhara logo" className="w-8 h-8 object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-foreground tracking-tight">JeevanDhara</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Verified Medical Funding</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-white hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-white hover:text-accent" asChild>
            <Link to="/hospital">Hospital Login</Link>
          </Button>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-white hover:text-accent" asChild>
            <Link to="/university">University Login</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-white hover:text-accent" asChild>
              <Link to="/hospital" onClick={() => setMobileOpen(false)}>Hospital Login</Link>
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-white hover:text-accent" asChild>
              <Link to="/university" onClick={() => setMobileOpen(false)}>University Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
