import { Navigation } from '@/components/navigation';
import { ArrowRight, Zap, Target, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="brutalist-heading text-black mb-8">
                AI FIXES
                <br />
                YOUR
                <br />
                <span className="text-accent">IMAGES</span>
              </h1>
              <p className="text-xl font-bold uppercase tracking-wide mb-12 max-w-lg">
                AUTOMATICALLY FROM REDDIT REQUESTS. NO MANUAL WORK. JUST RESULTS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/editor" className="brutalist-button-accent flex items-center justify-center gap-3">
                  <span>START FIXING</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <Link href="/queue" className="brutalist-button">
                  VIEW QUEUE
                </Link>
              </div>
            </div>
            
            <div className="brutalist-panel-dark">
              <div className="aspect-square bg-accent border-4 border-background mb-6"></div>
              <h3 className="text-2xl font-bold uppercase mb-4">BEFORE → AFTER</h3>
              <p className="font-bold uppercase text-sm tracking-wide">
                WATCH AI TRANSFORM DAMAGED IMAGES INTO PERFECT RESULTS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="brutalist-subheading text-center mb-16">
            HOW IT <span className="text-accent">WORKS</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="brutalist-panel-dark border-background">
              <Zap className="w-16 h-16 mb-6 text-accent" />
              <h3 className="text-2xl font-bold uppercase mb-4">INSTANT</h3>
              <p className="font-bold uppercase text-sm tracking-wide">
                AI PROCESSES IMAGES IN SECONDS, NOT HOURS
              </p>
            </div>
            
            <div className="brutalist-panel-dark border-background">
              <Target className="w-16 h-16 mb-6 text-accent" />
              <h3 className="text-2xl font-bold uppercase mb-4">PRECISE</h3>
              <p className="font-bold uppercase text-sm tracking-wide">
                TARGETED FIXES FOR SPECIFIC IMAGE PROBLEMS
              </p>
            </div>
            
            <div className="brutalist-panel-dark border-background">
              <Clock className="w-16 h-16 mb-6 text-accent" />
              <h3 className="text-2xl font-bold uppercase mb-4">24/7</h3>
              <p className="font-bold uppercase text-sm tracking-wide">
                CONTINUOUS PROCESSING OF REDDIT REQUESTS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="brutalist-subheading mb-8">
            READY TO <span className="text-accent">START?</span>
          </h2>
          <p className="text-xl font-bold uppercase tracking-wide mb-12">
            JOIN THE QUEUE AND WATCH AI FIX IMAGES AUTOMATICALLY
          </p>
          <Link href="/queue" className="brutalist-button-accent text-2xl px-12 py-6">
            ENTER QUEUE NOW
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-border bg-background py-12 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold uppercase tracking-wide">
            © 2025 FIXTRAL. AI IMAGE FIXING SYSTEM.
          </p>
        </div>
      </footer>
    </div>
  );
}