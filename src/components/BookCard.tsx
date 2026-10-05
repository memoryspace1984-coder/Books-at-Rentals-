import React from 'react';
import { Heart, BookOpen, Clock, Sparkles, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { Book } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onToggleWishlist: (bookId: string) => void;
  onSelectBook: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isWishlisted,
  onToggleWishlist,
  onSelectBook,
}) => {
  const isAvailable = book.availableCopies > 0 && book.availabilityStatus === 'Available Now';

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTap();
    onToggleWishlist(book.id);
  };

  const handleCardClick = () => {
    soundEngine.playTap();
    onSelectBook(book);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#2A2526]/10 hover:border-[#6B5B95]/40 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF7F2] overflow-hidden">
        {/* Book Cover Image with resilient fallback */}
        <img
          src={book.coverImage}
          alt={`Book cover of ${book.title} by ${book.author}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          onError={(e) => {
            // Stylized CSS fallback if image asset fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback container if image is hidden */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF7F2] to-[#F3EFFB]">
          <BookOpen className="w-12 h-12 text-[#6B5B95]/40 mb-2" />
          <span className="font-display font-bold text-sm text-[#2A2526]">{book.title}</span>
          <span className="text-xs text-[#7D7273]">{book.author}</span>
        </div>

        {/* Subtle Vinyl Track Line Pattern on Book Edge */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />

        {/* Interactive Heart Icon in the Top-Right Corner */}
        <button
          onClick={handleHeartClick}
          aria-label={isWishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-[#2A2526] hover:text-[#E0859D]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-[#E0859D] text-[#E0859D]'
                : 'text-[#7D7273] hover:text-[#E0859D]'
            }`}
          />
        </button>

        {/* Condition Tag on Bottom-Left of Cover */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-md shadow-xs ${
              book.condition === 'Stamped Copy'
                ? 'bg-[#FAF7F2]/95 text-[#6B5B95] border border-[#6B5B95]/30'
                : 'bg-white/95 text-[#2E7D5B] border border-[#2E7D5B]/30'
            }`}
          >
            {book.condition === 'Stamped Copy' ? '📚 Stamped Copy' : '✨ Pristine Copy'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Title, Author & Genre */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#7D7273] mb-1">
            {book.genre}
          </div>
          <h3 className="font-display font-bold text-base text-[#2A2526] group-hover:text-[#6B5B95] transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-[#7D7273] line-clamp-1 mt-0.5">
            by {book.author}
          </p>
        </div>

        {/* Dynamic Status Badges & Counters */}
        <div className="space-y-2 pt-1 border-t border-[#2A2526]/5">
          
          {/* Dynamic Availability Badge (Green for available, Soft Amber for all rented) */}
          <div className="flex items-center justify-between">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF5EE] text-[#2E7D5B] border border-[#2E7D5B]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" />
                <span>Available Now</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FDF3E1] text-[#D9822B] border border-[#D9822B]/20">
                <Clock className="w-3.5 h-3.5 text-[#D9822B]" />
                <span>All Rented (Expected: {book.expectedBackDate || 'Soon'})</span>
              </span>
            )}

            {/* Total Copies Counter: e.g. "3 of 5 copies available" */}
            <span className="text-xs font-mono tabular-nums text-[#7D7273] font-medium">
              {book.availableCopies} of {book.totalCopies} copies
            </span>
          </div>

          {/* Rental Counter: e.g. "Rented 42 times by students" */}
          <div className="flex items-center justify-between text-xs text-[#7D7273]">
            <span className="flex items-center gap-1">
              <span className="text-[#6B5B95]">♩</span>
              <span>Rented {book.rentalCount} times by students</span>
            </span>
          </div>
        </div>

        {/* Action Button: Base Tier Rent Trigger */}
        <div className="pt-2">
          <button
            onClick={handleCardClick}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isAvailable
                ? 'bg-[#FAF7F2] border border-[#2A2526]/15 hover:bg-[#2A2526] hover:text-white text-[#2A2526] shadow-xs'
                : 'bg-white border border-[#2A2526]/10 hover:border-[#D9822B] text-[#7D7273] hover:text-[#D9822B]'
            }`}
          >
            {/* Play Button Motif */}
            <span className="w-4 h-4 rounded-full bg-[#6B5B95]/10 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-[#6B5B95] text-[#6B5B95] translate-x-0.2" />
            </span>
            <span>
              {isAvailable ? 'Rent Copy for ₹89 / 7 days' : 'Notify Me When Returned'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
