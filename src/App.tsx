/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BookCard } from './components/BookCard';
import { CatalogFilter } from './components/CatalogFilter';
import { CheckoutModal } from './components/CheckoutModal';
import { ReadingGoals } from './components/ReadingGoals';
import { MyRentals } from './components/MyRentals';
import { WishlistDrawer } from './components/WishlistDrawer';
import { INITIAL_BOOKS, INITIAL_USER_RENTALS } from './data/initialBooks';
import { Book, BookGenre, BookCondition, Rental } from './types/book';
import { soundEngine } from './utils/audioPlayer';
import {
  Sparkles,
  BookOpen,
  Disc3,
  ShieldCheck,
  Clock,
  Heart,
  Music,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'rentals' | 'goals'>('home');

  // Catalog State
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);

  // Wishlist State (persisted locally)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('books_rentals_wishlist');
      return saved ? JSON.parse(saved) : ['book-1', 'book-4'];
    } catch {
      return ['book-1', 'book-4'];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // User Rentals State
  const [activeRentals, setActiveRentals] = useState<Rental[]>(INITIAL_USER_RENTALS.activeRentals as Rental[]);
  const [pastRentals, setPastRentals] = useState<Rental[]>(INITIAL_USER_RENTALS.pastRentals as Rental[]);

  // Student Wallet Balance (Mock preloaded campus grant)
  const [studentWalletBalance, setStudentWalletBalance] = useState<number>(450);

  // Reading Goals Target (Books per month)
  const [monthlyTarget, setMonthlyTarget] = useState<number>(4);

  // Checkout Modal State
  const [selectedBookForCheckout, setSelectedBookForCheckout] = useState<Book | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<BookGenre>('All Genres');
  const [conditionFilter, setConditionFilter] = useState<'All' | BookCondition>('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'availability'>('popularity');

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('books_rentals_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  // Wishlist Handlers
  const handleToggleWishlist = (bookId: string) => {
    setWishlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleRemoveFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== bookId));
  };

  // Filtered & Sorted Catalog
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchGenre = book.genre.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchGenre) return false;
        }

        // Genre filter
        if (selectedGenre !== 'All Genres' && book.genre !== selectedGenre) {
          return false;
        }

        // Condition filter
        if (conditionFilter !== 'All' && book.condition !== conditionFilter) {
          return false;
        }

        // Availability filter
        if (availableOnly && (book.availableCopies === 0 || book.availabilityStatus !== 'Available Now')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') {
          return b.rentalCount - a.rentalCount;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'availability') {
          return b.availableCopies - a.availableCopies;
        }
        return 0;
      });
  }, [books, searchQuery, selectedGenre, conditionFilter, availableOnly, sortBy]);

  // Wishlisted Book Objects
  const wishlistBooks = useMemo(() => {
    return books.filter((b) => wishlist.includes(b.id));
  }, [books, wishlist]);

  // Rental Success Handler
  const handleRentalSuccess = (newRental: Rental) => {
    // 1. Add to active rentals
    setActiveRentals((prev) => [newRental, ...prev]);

    // 2. Decrement available copies in catalog and increment rental counter
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === newRental.bookId) {
          const nextAvailable = Math.max(0, b.availableCopies - 1);
          return {
            ...b,
            availableCopies: nextAvailable,
            availabilityStatus: nextAvailable > 0 ? 'Available Now' : 'All Rented',
            expectedBackDate: nextAvailable === 0 ? 'Oct 14, 2026' : b.expectedBackDate,
            rentalCount: b.rentalCount + 1,
          };
        }
        return b;
      })
    );
  };

  // Return Book Handler
  const handleReturnBook = (rentalId: string, lateFee: number) => {
    const targetRental = activeRentals.find((r) => r.id === rentalId);
    if (!targetRental) return;

    // 1. Remove from active rentals
    setActiveRentals((prev) => prev.filter((r) => r.id !== rentalId));

    // 2. Add to past rentals
    const returnedRental: Rental = {
      ...targetRental,
      status: 'returned',
      returnedDate: new Date('2026-10-05T10:00:00Z').toISOString(),
      lateFeeCharged: lateFee,
    };
    setPastRentals((prev) => [returnedRental, ...prev]);

    // 3. Restore inventory copy in catalog
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === targetRental.bookId) {
          const nextAvailable = Math.min(b.totalCopies, b.availableCopies + 1);
          return {
            ...b,
            availableCopies: nextAvailable,
            availabilityStatus: 'Available Now',
          };
        }
        return b;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A2526] flex flex-col font-sans selection:bg-[#E0859D]/30">
      
      {/* Top Navigation Bar with strict 3-zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        activeRentalsCount={activeRentals.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Banner with required copy & musical motifs */}
            <HeroBanner
              onExploreCatalog={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              onViewGoals={() => {
                setActiveTab('goals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Physical Catalog Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#2A2526]/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#6B5B95] font-semibold uppercase tracking-wider">
                    <span>♪ Featured Physical Catalog</span>
                    <span>·</span>
                    <span>₹89 Base Tier</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#2A2526] mt-1">
                    Authentic Paperbacks & Textbooks
                  </h2>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTab('catalog');
                  }}
                  className="text-xs font-semibold text-[#6B5B95] hover:text-[#2A2526] flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Explore full catalog ({books.length} titles)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Strip */}
              <CatalogFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                conditionFilter={conditionFilter}
                setConditionFilter={setConditionFilter}
                availableOnly={availableOnly}
                setAvailableOnly={setAvailableOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Grid of Reusable BookCards */}
              {filteredBooks.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-[#2A2526]/10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] mx-auto flex items-center justify-center text-[#7D7273]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#2A2526]">No Books Matched</h4>
                  <p className="text-xs text-[#7D7273]">Try loosening your search or genre filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All Genres');
                      setConditionFilter('All');
                      setAvailableOnly(false);
                    }}
                    className="px-4 py-2 rounded-full bg-[#2A2526] text-white text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBooks.slice(0, 8).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      isWishlisted={wishlist.includes(book.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onSelectBook={(selected) => setSelectedBookForCheckout(selected)}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Reading Goals Motivation Module Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ReadingGoals
                activeRentals={activeRentals}
                pastRentals={pastRentals}
                monthlyTarget={monthlyTarget}
                onUpdateTarget={setMonthlyTarget}
                onExploreCatalog={() => setActiveTab('catalog')}
              />
            </section>

            {/* Transparent Financial Architecture Explainer */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2A2526]/10 space-y-6">
                
                <div className="flex items-center gap-2 text-xs font-mono text-[#6B5B95] font-semibold uppercase">
                  <span>♬ Transparent Rental Architecture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Rule 1 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#2A2526]/5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#2A2526]/10 flex items-center justify-center text-[#2A2526]">
                      <Clock className="w-5 h-5 text-[#6B5B95]" />
                    </div>
                    <h4 className="font-display font-bold text-base text-[#2A2526]">
                      Base 7-Day Tier (₹89)
                    </h4>
                    <p className="text-xs text-[#7D7273] leading-relaxed">
                      Every physical book starts at a flat ₹89 for 7 full days. Perfect for midterms, exam sprints, or weekend leisure reading.
                    </p>
                  </div>

                  {/* Rule 2 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#2A2526]/5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#2A2526]/10 flex items-center justify-center text-[#2A2526]">
                      <Sparkles className="w-5 h-5 text-[#D9822B]" />
                    </div>
                    <h4 className="font-display font-bold text-base text-[#2A2526]">
                      Dynamic Late Fine Rule (₹10/day)
                    </h4>
                    <p className="text-xs text-[#7D7273] leading-relaxed">
                      Need extra days? No punitive penalties. Only a gentle ₹10 per day accumulates automatically after day 7. All transparently calculated upfront.
                    </p>
                  </div>

                  {/* Rule 3 */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#2A2526]/5 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#2A2526]/10 flex items-center justify-center text-[#2A2526]">
                      <ShieldCheck className="w-5 h-5 text-[#2E7D5B]" />
                    </div>
                    <h4 className="font-display font-bold text-base text-[#2A2526]">
                      Stamped vs. Pristine Checks
                    </h4>
                    <p className="text-xs text-[#7D7273] leading-relaxed">
                      Know exactly what is arriving. We explicitly flag authentic library stamped editions vs pristine archival copies before checkout.
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ================= TAB 2: BROWSE CATALOG ================= */}
        {activeTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
            
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#6B5B95] font-semibold uppercase">
                Browse Complete Physical Collection
              </div>
              <h1 className="font-display font-bold text-3xl text-[#2A2526]">
                Physical Library Catalog
              </h1>
              <p className="text-xs sm:text-sm text-[#7D7273]">
                Rent any physical edition for 7 days at ₹89 with transparent late fee guarantees.
              </p>
            </div>

            <CatalogFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              conditionFilter={conditionFilter}
              setConditionFilter={setConditionFilter}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isWishlisted={wishlist.includes(book.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectBook={(selected) => setSelectedBookForCheckout(selected)}
                />
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: MY RENTALS ================= */}
        {activeTab === 'rentals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <MyRentals
              activeRentals={activeRentals}
              pastRentals={pastRentals}
              onReturnBook={handleReturnBook}
              onExploreCatalog={() => setActiveTab('catalog')}
            />
          </div>
        )}

        {/* ================= TAB 4: READING GOALS ================= */}
        {activeTab === 'goals' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
            <ReadingGoals
              activeRentals={activeRentals}
              pastRentals={pastRentals}
              monthlyTarget={monthlyTarget}
              onUpdateTarget={setMonthlyTarget}
              onExploreCatalog={() => setActiveTab('catalog')}
            />
          </div>
        )}

      </main>

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistBooks={wishlistBooks}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onSelectBookToRent={(book) => setSelectedBookForCheckout(book)}
        onExploreCatalog={() => {
          setIsWishlistOpen(false);
          setActiveTab('catalog');
        }}
      />

      {/* Checkout Modal with Dynamic Pricing Slider & Payment Gateway */}
      {selectedBookForCheckout && (
        <CheckoutModal
          book={selectedBookForCheckout}
          isOpen={true}
          onClose={() => setSelectedBookForCheckout(null)}
          onRentalSuccess={(newRental) => {
            handleRentalSuccess(newRental);
            // After successful rental, smoothly show My Rentals tab
            setTimeout(() => {
              setSelectedBookForCheckout(null);
              setActiveTab('rentals');
            }, 600);
          }}
          studentWalletBalance={studentWalletBalance}
          onDeductWallet={(amount) => setStudentWalletBalance((b) => Math.max(0, b - amount))}
        />
      )}

      {/* Quiet, refined footer adhering to frontend constitution */}
      <footer className="bg-white border-t border-[#2A2526]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D7273]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#2A2526]">Books@Rentals</span>
            <span>·</span>
            <span>Real physical books with gentle rhythm</span>
          </div>

          <div className="flex items-center gap-6">
            <span>7 Days for ₹89</span>
            <span>₹10/day Late Rule</span>
            <span>Student Wallet Support</span>
          </div>

          <div className="font-mono text-[11px] text-[#7D7273]/80">
            © 2026 Books@Rentals
          </div>
        </div>
      </footer>

    </div>
  );
}
