import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">JeevanDhara</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered verified medical funding platform bridging hospitals and universities for patient welfare.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cases" className="hover:text-foreground transition-colors">Verified Cases</Link></li>
            <li><Link to="/transparency" className="hover:text-foreground transition-colors">Transparency</Link></li>
            <li><Link to="/admin" className="hover:text-foreground transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Portals</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/hospital" className="hover:text-foreground transition-colors">Hospital Portal</Link></li>
            <li><Link to="/university" className="hover:text-foreground transition-colors">University Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-default">Privacy Policy</span></li>
            <li><span className="cursor-default">Terms of Service</span></li>
            <li><span className="cursor-default">Data Protection</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground">© 2026 JeevanDhara. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">Powered by AI-driven verification and institutional trust.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
