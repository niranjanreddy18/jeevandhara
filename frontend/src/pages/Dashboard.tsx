import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, BarChart3, Heart, FileText } from "lucide-react";
import { getSession } from "@/lib/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState(getSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const session = getSession();
    setCurrentSession(session);
    setIsLoading(false);

    // Redirect to login if not authenticated or wrong role
    if (!session || session.userType !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Update loading state when session changes
    if ((!currentSession || currentSession.userType !== "user") && !isLoading) {
      navigate("/login");
    }
  }, [currentSession, navigate, isLoading]);

  useEffect(() => {
    // Listen for session changes
    const onSessionChange = (e: any) => {
      setCurrentSession(e.detail);
    };
    window.addEventListener("jh:session-changed", onSessionChange);
    return () =>
      window.removeEventListener("jh:session-changed", onSessionChange);
  }, []);

  if (!currentSession) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back to JeevanDhara
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                User ID: {currentSession.userId}
              </h2>
              <p className="text-sm text-muted-foreground">
                You are authenticated and logged in
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={`grid ${currentSession.userType === "user" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 mb-8`}
        >
          {/* Register Case - Only for normal users */}
          {currentSession.userType === "user" && (
            <div
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/register-case")}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Register Medical Case
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your medical case for AI verification and funding
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:bg-accent/10"
              >
                Register Case →
              </Button>
            </div>
          )}

          {/* Cases */}
          <div
            className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/cases")}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Verified Cases
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Browse and support verified medical cases
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              View Cases →
            </Button>
          </div>

          {/* Transparency */}
          <div
            className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/transparency")}
          >
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Transparency</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View funding details and reports
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-success hover:bg-success/10"
            >
              View Report →
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Welcome to JeevanDhara
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            A verified medical funding platform dedicated to supporting patients
            in need. Browse cases, contribute to medical expenses, and make a
            difference.
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
