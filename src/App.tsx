import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Activity, Dna, Droplet, MousePointer2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

function NoiseOverlay() {
  return (
    <svg className="noise-overlay">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function Button({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-full px-8 py-4 font-sans text-sm font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.03] hover:-translate-y-[1px] group",
        variant === 'primary' ? "bg-moss text-cream" : "bg-transparent border border-charcoal/20 text-charcoal hover:border-charcoal",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === 'primary' && (
        <span className="absolute inset-0 z-0 bg-clay translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
      )}
    </button>
  );
}

function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center justify-between rounded-full px-6 py-3 transition-all duration-500 w-[90%] max-w-5xl",
        isScrolled 
          ? "bg-cream/60 backdrop-blur-xl border border-charcoal/10 shadow-sm text-charcoal" 
          : "bg-transparent text-cream"
      )}
    >
      <div className="font-heading text-xl font-bold tracking-tight">Nura Health</div>
      <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
        <a href="#features" className="hover:-translate-y-[1px] transition-transform">Protocol</a>
        <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform">Philosophy</a>
        <a href="#membership" className="hover:-translate-y-[1px] transition-transform">Membership</a>
      </div>
      <Button className={cn("px-6 py-2.5 text-xs", isScrolled ? "bg-moss" : "bg-cream text-moss")} variant="primary">
        Join the waitlist
      </Button>
    </nav>
  );
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-anim",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-charcoal">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2532&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
      
      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-16 lg:p-24 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <h1 className="flex flex-col gap-2 mb-8">
            <span className="hero-anim font-heading text-3xl md:text-5xl font-bold tracking-tight text-cream uppercase">
              Longevity is the
            </span>
            <span className="hero-anim font-drama text-7xl md:text-9xl italic text-cream leading-[0.85]">
              Baseline.
            </span>
          </h1>
          <p className="hero-anim font-sans text-lg md:text-xl text-cream/80 max-w-xl mb-10 text-balance">
            Precision longevity medicine powered by biological data. We don't just track aging; we engineer its reversal.
          </p>
          <div className="hero-anim">
            <Button>
              Join the waitlist <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagnosticShuffler() {
  const [items, setItems] = useState([
    { id: 1, title: "Blood Panel", icon: Droplet, value: "Optimal" },
    { id: 2, title: "DNA Methylation", icon: Dna, value: "Age 34.2" },
    { id: 3, title: "Metabolic Rate", icon: Activity, value: "1850 kcal" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const last = newItems.pop()!;
        newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center perspective-1000">
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isSecond = index === 1;
        const isThird = index === 2;
        
        return (
          <div
            key={item.id}
            className="absolute w-full max-w-[240px] rounded-2xl bg-cream border border-charcoal/10 p-4 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between"
            style={{
              transform: `translateY(${index * 16}px) scale(${1 - index * 0.05})`,
              zIndex: 3 - index,
              opacity: 1 - index * 0.2,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/10 text-moss">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-heading font-medium text-sm">{item.title}</span>
            </div>
            <span className="font-mono text-xs text-moss font-semibold">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function TelemetryTypewriter() {
  const [text, setText] = useState("");
  const fullText = "Analyzing epigenetic markers...\nCellular age: 34.2 yrs\nTelomere length: 7.4kb\nInflammation: Low\nProtocol updated.";
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0;
        setText("");
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64 w-full rounded-2xl bg-charcoal p-6 flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-clay animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-cream/50">Live Feed</span>
      </div>
      <pre className="font-mono text-xs text-cream/80 whitespace-pre-wrap leading-relaxed">
        {text}
        <span className="inline-block w-2 h-3 bg-clay ml-1 animate-pulse" />
      </pre>
    </div>
  );
}

function CursorProtocolScheduler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      tl.set(cursorRef.current, { x: 20, y: 150, opacity: 0 })
        .to(cursorRef.current, { opacity: 1, duration: 0.3 })
        .to(cursorRef.current, { x: 120, y: 80, duration: 1, ease: "power2.inOut" })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(".day-cell-active", { backgroundColor: "#2E4036", color: "#F2F0E9", duration: 0.2 }, "-=0.1")
        .to(cursorRef.current, { x: 200, y: 180, duration: 1, ease: "power2.inOut", delay: 0.5 })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(buttonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, "-=0.1")
        .to(cursorRef.current, { opacity: 0, duration: 0.3, delay: 0.5 })
        .set(".day-cell-active", { backgroundColor: "transparent", color: "inherit" });
        
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div ref={containerRef} className="relative h-64 w-full rounded-2xl border border-charcoal/10 bg-cream p-6 flex flex-col justify-between">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div 
            key={i} 
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs border border-charcoal/10",
              i === 3 ? "day-cell-active transition-colors" : ""
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-charcoal/5" />
        <div className="h-2 w-1/2 rounded-full bg-charcoal/5" />
      </div>

      <div ref={buttonRef} className="self-end rounded-full bg-moss/10 px-4 py-1.5 font-mono text-[10px] font-semibold text-moss uppercase tracking-wider">
        Save Protocol
      </div>

      <div ref={cursorRef} className="absolute top-0 left-0 z-10 pointer-events-none">
        <MousePointer2 className="h-6 w-6 text-clay fill-clay/20" />
      </div>
    </div>
  );
}

function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="feature-card flex flex-col gap-6">
          <DiagnosticShuffler />
          <div>
            <h3 className="font-heading text-xl font-bold mb-2">Continuous Biomarker Tracking</h3>
            <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
              We monitor your biological age through comprehensive blood panels, DNA methylation, and metabolic rate analysis.
            </p>
          </div>
        </div>

        <div className="feature-card flex flex-col gap-6">
          <TelemetryTypewriter />
          <div>
            <h3 className="font-heading text-xl font-bold mb-2">Real-time Epigenetic Telemetry</h3>
            <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
              Live feed of your cellular age metrics. Watch your biological age reverse as you implement our protocols.
            </p>
          </div>
        </div>

        <div className="feature-card flex flex-col gap-6">
          <CursorProtocolScheduler />
          <div>
            <h3 className="font-heading text-xl font-bold mb-2">Adaptive Supplement Protocols</h3>
            <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
              Your interventions adapt dynamically. Our system schedules daily protocols based on your latest telemetry.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.fromTo(
        ".phil-text",
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={containerRef} className="relative py-40 px-6 md:px-12 overflow-hidden bg-charcoal text-cream rounded-[3rem] mx-4 md:mx-8">
      <div 
        className="parallax-bg absolute inset-0 bg-cover bg-center opacity-20 scale-125"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618423835718-20fa0480e118?q=80&w=2000&auto=format&fit=crop')" }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-12">
        <p className="phil-text font-sans text-xl md:text-2xl text-cream/60 max-w-2xl">
          Most medicine focuses on: <span className="text-cream">reactive symptom management.</span>
        </p>
        <h2 className="phil-text font-drama text-5xl md:text-7xl italic leading-[1.1]">
          We focus on: <br/>
          <span className="text-clay">proactive cellular optimization.</span>
        </h2>
      </div>
    </section>
  );
}

function Protocol() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card') as HTMLElement[];
      
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Don't animate the last card out
        
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Quantify",
      desc: "Comprehensive baseline mapping of your biological age.",
      visual: (
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-moss/20" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-moss/40" strokeDasharray="4 4" />
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" className="text-moss/20" />
          <circle cx="50" cy="10" r="2" fill="currentColor" className="text-clay" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Intervene",
      desc: "Targeted protocols to reverse cellular senescence.",
      visual: (
        <div className="relative w-full h-full border border-moss/20 rounded-full overflow-hidden flex items-center justify-center">
          <div className="grid grid-cols-5 gap-2 w-2/3 h-2/3">
            {Array.from({length: 25}).map((_, i) => (
              <div key={i} className="bg-moss/10 rounded-sm" />
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-clay/50 shadow-[0_0_15px_rgba(204,88,51,0.8)] animate-[scan_3s_ease-in-out_infinite_alternate]" />
        </div>
      )
    },
    {
      num: "03",
      title: "Optimize",
      desc: "Continuous telemetry and protocol refinement.",
      visual: (
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path 
            d="M0 25 L20 25 L25 10 L35 45 L45 5 L55 35 L60 25 L100 25" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="text-moss animate-[dash_3s_linear_infinite]" 
            strokeDasharray="100" 
            strokeDashoffset="100"
          />
        </svg>
      )
    }
  ];

  return (
    <section ref={containerRef} className="py-32 relative">
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(1000%); }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      
      {steps.map((step, i) => (
        <div key={i} className="protocol-card sticky top-0 h-[100dvh] flex items-center justify-center p-6">
          <div className="w-full max-w-5xl bg-cream border border-charcoal/10 rounded-[3rem] p-12 md:p-24 shadow-xl flex flex-col md:flex-row items-center gap-16">
            
            <div className="flex-1 space-y-6">
              <div className="font-mono text-sm text-clay font-semibold tracking-widest">STEP {step.num}</div>
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-charcoal">{step.title}</h2>
              <p className="font-sans text-lg text-charcoal/70 max-w-md">{step.desc}</p>
            </div>

            <div className="flex-1 w-full aspect-square max-w-md relative flex items-center justify-center">
              {step.visual}
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}

function Membership() {
  return (
    <section id="membership" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Membership</h2>
        <p className="font-sans text-charcoal/60 max-w-xl mx-auto">Select your level of biological optimization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Tier 1 */}
        <div className="rounded-[2.5rem] border border-charcoal/10 p-8 bg-cream">
          <h3 className="font-heading text-2xl font-bold mb-2">Foundation</h3>
          <div className="font-mono text-sm text-charcoal/50 mb-8">Quarterly panels</div>
          <div className="text-4xl font-bold font-heading mb-8">$299<span className="text-lg text-charcoal/50 font-sans font-normal">/mo</span></div>
          <ul className="space-y-4 font-sans text-sm text-charcoal/80 mb-8">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Basic biological age tracking</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Quarterly blood panels</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Standard supplement protocol</li>
          </ul>
          <Button variant="outline" className="w-full">Select Foundation</Button>
        </div>

        {/* Tier 2 */}
        <div className="rounded-[2.5rem] border-2 border-moss p-10 bg-moss text-cream relative transform md:scale-105 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-clay text-cream font-mono text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
            Recommended
          </div>
          <h3 className="font-heading text-2xl font-bold mb-2">Precision</h3>
          <div className="font-mono text-sm text-cream/60 mb-8">Monthly panels</div>
          <div className="text-4xl font-bold font-heading mb-8">$899<span className="text-lg text-cream/60 font-sans font-normal">/mo</span></div>
          <ul className="space-y-4 font-sans text-sm text-cream/90 mb-8">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-clay" /> Advanced epigenetic tracking</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-clay" /> Monthly comprehensive panels</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-clay" /> Adaptive daily protocols</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-clay" /> Dedicated longevity physician</li>
          </ul>
          <Button className="w-full bg-cream text-moss hover:bg-cream/90">
            <span className="relative z-10 text-moss">Select Precision</span>
            <span className="absolute inset-0 z-0 bg-clay translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
          </Button>
        </div>

        {/* Tier 3 */}
        <div className="rounded-[2.5rem] border border-charcoal/10 p-8 bg-cream">
          <h3 className="font-heading text-2xl font-bold mb-2">Apex</h3>
          <div className="font-mono text-sm text-charcoal/50 mb-8">Continuous telemetry</div>
          <div className="text-4xl font-bold font-heading mb-8">$2499<span className="text-lg text-charcoal/50 font-sans font-normal">/mo</span></div>
          <ul className="space-y-4 font-sans text-sm text-charcoal/80 mb-8">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Real-time continuous monitoring</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Experimental therapies access</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-moss" /> Full concierge service</li>
          </ul>
          <Button variant="outline" className="w-full">Select Apex</Button>
        </div>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal text-cream rounded-t-[4rem] pt-24 pb-12 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        <div className="md:col-span-2">
          <div className="font-heading text-3xl font-bold tracking-tight mb-4">Nura Health</div>
          <p className="font-sans text-cream/60 max-w-sm">
            Precision longevity medicine powered by biological data.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs text-cream/40 uppercase tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-3 font-sans text-sm text-cream/80">
            <li><a href="#features" className="hover:text-clay transition-colors">Protocol</a></li>
            <li><a href="#philosophy" className="hover:text-clay transition-colors">Philosophy</a></li>
            <li><a href="#membership" className="hover:text-clay transition-colors">Membership</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-cream/40 uppercase tracking-widest mb-6">Legal</h4>
          <ul className="space-y-3 font-sans text-sm text-cream/80">
            <li><a href="#" className="hover:text-clay transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-clay transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-clay transition-colors">Medical Disclaimer</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-sans text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Nura Health. All rights reserved.
        </div>
        
        <div className="flex items-center gap-2 bg-cream/5 rounded-full px-4 py-2 border border-cream/10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60">System Operational</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream selection:bg-moss selection:text-cream">
      <NoiseOverlay />
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <Membership />
      <Footer />
    </div>
  );
}
