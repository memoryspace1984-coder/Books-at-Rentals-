import React from 'react';
import { Play, Sparkles, ShieldCheck, Clock, BookOpen, Music } from 'lucide-react';
import { soundEngine } from '../utils/audioPlayer';

interface HeroBannerProps {
  onExploreCatalog: () => void;
  onViewGoals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCatalog,
  onViewGoals,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 lg:pb-20 border-b border-[#2A2526]/10">
      {/* Subtle lo-fi musical staff background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col justify-around py-12">
        <div className="border-b border-[#6B5B95]/30 w-full" />
        <div className="border-b border-[#6B5B95]/30 w-full" />
        <div className="border-b border-[#6B5B95]/30 w-full" />
        <div className="border-b border-[#6B5B95]/30 w-full" />
        <div className="border-b border-[#6B5B95]/30 w-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Ambient Kicker with musical notes */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#6B5B95]/20 shadow-xs">
              <span className="text-[#6B5B95] text-xs font-mono">♪ ♫ ♩</span>
              <span className="text-xs font-medium text-[#6B5B95] tracking-wide">
                Campus Physical Book Rental Service
              </span>
              <span className="text-[#6B5B95] text-xs font-mono">♩ ♫ ♪</span>
            </div>

            {/* Required Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A2526] leading-tight text-balance">
              Books@Rentals: Low prices. Real physical books. Gentle rhythm for your reading goals.
            </h1>

            {/* Body Description */}
            <p className="text-base sm:text-lg text-[#7D7273] max-w-2xl leading-relaxed">
              Why buy expensive paperbacks or strain your eyes on glass screens? Rent authentic physical textbooks, fiction, and philosophy for just <strong className="text-[#2A2526] font-semibold">₹89 for 7 days</strong>. Stamped library and pristine editions delivered straight to your desk.
            </p>

            {/* Primary Action Buttons with Musical Motif */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  onExploreCatalog();
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2A2526] text-[#FAF7F2] hover:bg-[#6B5B95] text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                {/* Play button motif */}
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-current text-white translate-x-0.5" />
                </span>
                <span>Browse Physical Catalog</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playTap();
                  onViewGoals();
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-[#2A2526]/15 hover:border-[#6B5B95] text-[#2A2526] text-sm font-medium transition-colors shadow-xs"
              >
                <Music className="w-4 h-4 text-[#6B5B95]" />
                <span>Reading Goals & Rhythm</span>
              </button>
            </div>

            {/* Trust points - Claim to proof adjacency */}
            <div className="pt-4 border-t border-[#2A2526]/10 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#2A2526]">₹89</div>
                <div className="text-xs text-[#7D7273]">7-Day Base Rental</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#2E7D5B]">₹10/day</div>
                <div className="text-xs text-[#7D7273]">Gentle Late Fee Rule</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#6B5B95]">100%</div>
                <div className="text-xs text-[#7D7273]">Real Physical Editions</div>
              </div>
            </div>

          </div>

          {/* Right Column: Lo-Fi Hero Showcase with Vinyl Motif */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Spinning Vinyl Record Peek */}
              <div className="absolute -top-6 -right-6 w-36 h-36 sm:w-44 sm:h-44 rounded-full vinyl-grooves animate-spin-slow opacity-85 hidden sm:flex items-center justify-center z-0">
                <div className="w-12 h-12 rounded-full bg-[#E0859D] border-4 border-[#2A2526] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#FAF7F2]" />
                </div>
              </div>

              {/* Main Lo-Fi Studio Image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="/src/assets/images/hero_lofi_books_rentals_1791219968059.jpg"
                  alt="Lo-fi cozy reading corner with physical books and vinyl player"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-80 object-cover"
                />

                {/* Floating Cassette / Now Playing Tag */}
                <div className="p-4 bg-white/95 border-t border-[#2A2526]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#2A2526]/10 flex items-center justify-center text-[#6B5B95]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#2A2526]">Physical Book Delivery</div>
                      <div className="text-[11px] text-[#7D7273]">Campus courier & dorm drops</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B] animate-ping" />
                    <span className="text-[11px] font-mono text-[#2E7D5B] font-medium">Circulating Today</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
