import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { casesData, formatCurrency } from "@/lib/cases";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Brain, Building2, GraduationCap, Activity, TrendingUp, Users, ArrowRight, Hospital, Cpu, Landmark, Award } from "lucide-react";

// stats will be computed inside component to use live totals from casesData

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Hospital Verification",
    description: "Registered hospitals submit patient cases with medical documentation and financial proof through a secure portal.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Cost Validation",
    description: "Our AI engine validates treatment costs, detects duplicates, benchmarks pricing, and assigns confidence scores.",
  },
  {
    step: "03",
    icon: Landmark,
    title: "University Funding",
    description: "Verified cases are matched with university CSR funds. Transparent disbursement with complete audit trails.",
  },
];

const topContributors = [
  { name: "IIT Bombay", amount: "₹2.4 Cr", cases: 84, logo: "/universities/iit-bombay.png" },
  { name: "AIIMS Delhi", amount: "₹1.9 Cr", cases: 67, logo: null, initials: "AIIMS" },
  { name: "IIT Madras", amount: "₹1.7 Cr", cases: 58, logo: "/universities/iit-madras.png" },
  { name: "BITS Pilani", amount: "₹1.3 Cr", cases: 45, logo: "/universities/bits-pilani.png" },
  { name: "IISc Bangalore", amount: "₹1.1 Cr", cases: 39, logo: null, initials: "IISc" },
  { name: "NIT Trichy", amount: "₹98 L", cases: 34, logo: null, initials: "NITT" },
  { name: "IIT Delhi", amount: "₹92 L", cases: 31, logo: "/universities/iit-delhi.png" },
  { name: "VIT Vellore", amount: "₹85 L", cases: 28, logo: "/universities/vit-vellore.png" },
  { name: "IIT Kanpur", amount: "₹78 L", cases: 26, logo: "/universities/iit-kanpur.png" },
  { name: "MAHE Manipal", amount: "₹72 L", cases: 24, logo: null, initials: "MAHE" },
];

const Index = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);
  const totalRequired = casesData.reduce((s, c) => s + c.required, 0);
  const totalCollected = casesData.reduce((s, c) => s + c.collected, 0);
  const stats = [
    { label: "Verified Cases", value: String(casesData.length), icon: CheckCircle },
    { label: "Funds Collected", value: formatCurrency(totalCollected), icon: TrendingUp },
    { label: "Total Required", value: formatCurrency(totalRequired), icon: Award },
    { label: "Partner Hospitals", value: "156", icon: Hospital },
  ];
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>

        {/* Sliding Top Donor Universities - Large Version */}
        <div className="relative pt-6 pb-0">
            <div className="container mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-white" />
              <p className="text-sm font-semibold text-white tracking-wider uppercase">Top Contributors</p>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-hidden whitespace-nowrap px-4"
            style={{ scrollBehavior: 'auto' }}
          >
            {[...topContributors, ...topContributors].map((uni, i) => (
              <div
                key={i}
                className="inline-flex flex-col items-center justify-center gap-1.5 min-w-[100px] bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl px-2 py-3 shrink-0 hover:bg-primary-foreground/15 transition-colors animate-slideInLeft"
                style={{
                  animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`
                }}
              >
                <div className="w-14 h-14 rounded-lg bg-primary-foreground/25 flex items-center justify-center shrink-0 overflow-hidden border border-primary-foreground/10">
                  {uni.logo ? (
                    <img src={uni.logo} alt={uni.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-accent text-center px-1">{(uni as any).initials}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-primary-foreground leading-tight">{uni.name}</p>
                  <p className="text-xs text-primary-foreground/70">{uni.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container relative py-8 md:py-12 px-8 md:px-16 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Hero Content */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground/70 tracking-wider uppercase">
                  Government-Grade Verified Platform
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-[1.15] mb-4 text-balance">
                Verified Medical Funding Through AI and Institutional Trust
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/70 mb-6 leading-relaxed">
                JeevanDhara bridges verified hospitals and universities to fund life-saving treatments for financially vulnerable patients — powered by AI validation and complete transparency.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild>
                  <Link to="/hospital">
                    <Building2 className="w-4 h-4 mr-2" />
                    Hospital Login
                  </Link>
                </Button>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild>
                  <Link to="/university">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    University Login
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 font-medium" asChild>
                  <Link to="/cases">
                    View Verified Cases
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Side - How It Works Circular */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold text-accent tracking-wider uppercase mb-2">How It Works</p>
                <h3 className="text-xl md:text-2xl font-bold text-primary-foreground">
                  Three-Step Pipeline
                </h3>
              </div>
              
              {/* Circular Container */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Center Circle */}
                <div className="absolute w-20 h-20 rounded-full bg-primary-foreground/10 border-2 border-accent/30 flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-accent uppercase">Verified</p>
                    <p className="text-xs font-bold text-primary-foreground">Funding</p>
                  </div>
                </div>

                {/* Rotating Steps Container */}
                <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
                  {steps.map((step, i) => {
                    const angle = (i * 120);
                    const radius = 80;
                    const x = radius * Math.cos((angle * Math.PI) / 180);
                    const y = radius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <div
                        key={i}
                        className="absolute w-24"
                        style={{
                          left: `calc(50% + ${x}px - 48px)`,
                          top: `calc(50% + ${y}px - 48px)`,
                          animation: `spin-reverse 20s linear infinite`
                        }}
                      >
                        <div className="relative bg-primary-foreground/10 rounded-full p-2 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors text-center w-24 h-24 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-accent/30 absolute top-0.5">{step.step}</span>
                          <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center mb-0.5 z-10">
                            <step.icon className="w-3 h-3 text-accent" />
                          </div>
                          <h4 className="text-xs font-semibold text-primary-foreground mb-0.5">{step.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Orbital Path Line */}
                <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-accent/20"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Brain className="w-8 h-8 text-accent" />
              <h3 className="text-base font-semibold text-foreground">AI-Powered Validation</h3>
              <p className="text-sm text-muted-foreground max-w-xs">Every case undergoes automated cost benchmarking, duplicate detection, and risk scoring.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Activity className="w-8 h-8 text-accent" />
              <h3 className="text-base font-semibold text-foreground">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground max-w-xs">Track funding progress, disbursement status, and case outcomes in real time.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Users className="w-8 h-8 text-accent" />
              <h3 className="text-base font-semibold text-foreground">Institutional Network</h3>
              <p className="text-sm text-muted-foreground max-w-xs">Verified hospitals and universities form a trusted funding ecosystem.</p>
            </div>
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to make an impact?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join JeevanDhara's verified network as a hospital or university partner and help save lives through transparent, AI-validated funding.
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild>
              <Link to="/hospital">Register Hospital</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/university">Register University</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
