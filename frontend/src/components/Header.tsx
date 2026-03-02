import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cases", label: "Verified Cases" },
  { to: "/transparency", label: "Transparency" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(getSession());

  useEffect(() => {
    const onSessionChange = (e: any) => {
      setCurrentSession(e.detail);
    };
    window.addEventListener("jh:session-changed", onSessionChange);
    return () =>
      window.removeEventListener("jh:session-changed", onSessionChange);
  }, []);

  const isLoggedIn = currentSession !== null;

  const getPanelUrl = () => {
    switch (currentSession?.userType) {
      case "hospital":
        return "/hospital";
      case "university":
        return "/university";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
            <img
              src="/logo.jpeg"
              alt="JeevanDhara logo"
              className="w-8 h-8 object-cover"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-foreground tracking-tight">
              JeevanDhara
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Verified Medical Funding
            </span>
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
          {isLoggedIn && (
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
              asChild
            >
              <Link to={getPanelUrl()}>
                {currentSession?.userType === "hospital" && "Hospital Panel"}
                {currentSession?.userType === "university" &&
                  "University Panel"}
                {currentSession?.userType === "admin" && "Admin Panel"}
              </Link>
            </Button>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!isLoggedIn && (
            <>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/hospital">Hospital</Link>
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/university">University</Link>
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/admin">Admin</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ?
            <X className="w-5 h-5" />
          : <Menu className="w-5 h-5" />}
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
          {isLoggedIn && (
            <Button
              size="sm"
              className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-accent"
              asChild
            >
              <Link to={getPanelUrl()} onClick={() => setMobileOpen(false)}>
                {currentSession?.userType === "hospital" && "Hospital Panel"}
                {currentSession?.userType === "university" &&
                  "University Panel"}
                {currentSession?.userType === "admin" && "Admin Panel"}
              </Link>
            </Button>
          )}
          {!isLoggedIn && (
            <div className="pt-2 flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/hospital" onClick={() => setMobileOpen(false)}>
                  Hospital
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/university" onClick={() => setMobileOpen(false)}>
                  University
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-white hover:text-accent"
                asChild
              >
                <Link to="/admin" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
