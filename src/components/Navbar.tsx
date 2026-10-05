import React, { useState, useEffect } from 'react';
import { Heart, Disc3, Volume2, VolumeX, Menu, X, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/audioPlayer';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'rentals' | 'goals';
  setActiveTab: (tab: 'home' | 'catalog' | 'rentals' | 'goals') => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  activeRentalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wishlistCount,
  onOpenWishlist,
  activeRentalsCount,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsPlayingAudio(soundEngine.getIsPlaying());
  }, []);

  const handleAudioToggle = () => {
    const nextState = soundEngine.toggleAmbient();
    setIsPlayingAudio(nextState);
  };

  const navItems: Array<{ id: 'home' | 'catalog' | 'rentals' | 'goals'; label: string; badge?: number }> = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Browse Catalog' },
    { id: 'rentals', label: 'My Rentals', badge: activeRentalsCount },
    { id: 'goals', label: 'Reading Goals' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2A2526]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <span className="w-8 h-8 rounded-full bg-[#6B5B95] text-[#FAF7F2] flex items-center justify-center shadow-xs group-hover:rotate-45 transition-transform duration-300">
            <Disc3 className="w-4 h-4" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[#2A2526]">
            Books@Rentals
          </span>
        </button>

        {/* Zone 2: 4 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                soundEngine.playTap();
              }}
              className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === item.id
                  ? 'text-[#2A2526] font-semibold'
                  : 'text-[#7D7273] hover:text-[#2A2526]'
              }`}
            >
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[11px] font-mono font-medium rounded-full bg-[#E0859D]/20 text-[#A63C59]">
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B5B95] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Wishlist & Lo-Fi Audio Toggle) */}
        <div className="flex items-center gap-3">
          {/* Lo-Fi Ambient Study Audio Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isPlayingAudio ? 'Mute Lo-Fi study chords' : 'Play Lo-Fi study chords'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isPlayingAudio
                ? 'bg-[#EBF5EE] border-[#2E7D5B]/30 text-[#2E7D5B] shadow-xs'
                : 'bg-white/80 border-[#2A2526]/10 text-[#7D7273] hover:text-[#2A2526]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#2E7D5B] animate-pulse" />
                <span className="hidden sm:inline">Lo-Fi Study Beat</span>
                <span className="flex gap-0.5 items-end h-2.5">
                  <span className="w-0.5 h-full bg-[#2E7D5B] animate-[eqBounce_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2/3 bg-[#2E7D5B] animate-[eqBounce_1.1s_ease-in-out_infinite_0.2s]" />
                  <span className="w-0.5 h-4/5 bg-[#2E7D5B] animate-[eqBounce_0.9s_ease-in-out_infinite_0.4s]" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lo-Fi Chords</span>
              </>
            )}
          </button>

          {/* Reading Wishlist Drawer Trigger */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#2A2526]/10 hover:border-[#E0859D] text-xs font-medium text-[#2A2526] hover:text-[#A63C59] transition-all shadow-xs group"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${wishlistCount > 0 ? 'fill-[#E0859D] text-[#E0859D]' : 'text-[#7D7273]'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            <span className="font-mono tabular-nums text-xs px-1.5 py-0.2 rounded-full bg-[#FCEFF2] text-[#A63C59] font-semibold">
              {wishlistCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#2A2526] hover:bg-black/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#2A2526]/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-[#6B5B95]/10 text-[#6B5B95]'
                  : 'text-[#2A2526] hover:bg-black/5'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-[#E0859D]/20 text-[#A63C59]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
