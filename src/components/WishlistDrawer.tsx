import React from 'react';
import { X, Heart, Trash2, ArrowRight, BookOpen, Play } from 'lucide-react';
import { Book } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistBooks: Book[];
  onRemoveFromWishlist: (bookId: string) => void;
  onSelectBookToRent: (book: Book) => void;
  onExploreCatalog: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistBooks,
  onRemoveFromWishlist,
  onSelectBookToRent,
  onExploreCatalog,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-[#2A2526]/10 animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2A2526]/10 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FCEFF2] flex items-center justify-center text-[#E0859D]">
              <Heart className="w-4 h-4 fill-[#E0859D]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2A2526]">My Reading Wishlist</h3>
              <span className="text-xs text-[#7D7273]">
                {wishlistBooks.length} {wishlistBooks.length === 1 ? 'book' : 'books'} saved for future tracks
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#7D7273] hover:text-[#2A2526] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistBooks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FCEFF2] flex items-center justify-center text-[#E0859D]">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#2A2526]">Your Wishlist is Empty</h4>
                <p className="text-xs text-[#7D7273] max-w-xs mt-1">
                  Click the heart icon on any physical book in the catalog to bookmark it for later study sessions!
                </p>
              </div>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  onClose();
                  onExploreCatalog();
                }}
                className="px-5 py-2.5 rounded-full bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold shadow-xs"
              >
                Browse Books Catalog
              </button>
            </div>
          ) : (
            wishlistBooks.map((book) => {
              const isAvailable = book.availableCopies > 0 && book.availabilityStatus === 'Available Now';

              return (
                <div
                  key={book.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#2A2526]/10 flex gap-3.5 shadow-2xs hover:border-[#6B5B95]/30 transition-all"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-22 object-cover rounded-lg border border-[#2A2526]/10 shadow-2xs shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-display font-bold text-sm text-[#2A2526] line-clamp-1">
                          {book.title}
                        </h5>
                        <button
                          onClick={() => {
                            soundEngine.playTap();
                            onRemoveFromWishlist(book.id);
                          }}
                          className="text-[#7D7273] hover:text-[#A63C59] p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#7D7273] line-clamp-1">by {book.author}</p>
                      
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#6B5B95]">
                          {book.condition}
                        </span>
                        <span className="text-[10px] text-[#7D7273]">·</span>
                        <span className="text-[10px] text-[#7D7273]">
                          {book.availableCopies} left
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#2A2526]">₹89 / 7 days</span>

                      <button
                        onClick={() => {
                          soundEngine.playTap();
                          onClose();
                          onSelectBookToRent(book);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isAvailable
                            ? 'bg-[#2A2526] hover:bg-[#6B5B95] text-white shadow-xs'
                            : 'bg-[#FAF7F2] text-[#7D7273] border border-[#2A2526]/15 hover:border-[#D9822B]'
                        }`}
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{isAvailable ? 'Rent' : 'Reserve'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {wishlistBooks.length > 0 && (
          <div className="p-4 border-t border-[#2A2526]/10 bg-white flex items-center justify-between text-xs">
            <span className="text-[#7D7273]">Budget-friendly physical rentals</span>
            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
                onExploreCatalog();
              }}
              className="text-[#6B5B95] font-semibold flex items-center gap-1 hover:underline"
            >
              <span>Explore more books</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
