import React from 'react';
import { Search, Filter, SlidersHorizontal, Check } from 'lucide-react';
import { BookGenre, BookCondition } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface CatalogFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: BookGenre;
  setSelectedGenre: (genre: BookGenre) => void;
  conditionFilter: 'All' | BookCondition;
  setConditionFilter: (cond: 'All' | BookCondition) => void;
  availableOnly: boolean;
  setAvailableOnly: (avail: boolean) => void;
  sortBy: 'popularity' | 'rating' | 'availability';
  setSortBy: (sort: 'popularity' | 'rating' | 'availability') => void;
}

export const CatalogFilter: React.FC<CatalogFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  conditionFilter,
  setConditionFilter,
  availableOnly,
  setAvailableOnly,
  sortBy,
  setSortBy,
}) => {
  const genres: BookGenre[] = [
    'All Genres',
    'Computer Science & Tech',
    'Literature & Poetry',
    'Psychology & Mind',
    'Music & Art',
    'Philosophy & Life',
  ];

  return (
    <div className="space-y-4">
      {/* Top Search & Primary Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7D7273] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#2A2526]/15 text-xs text-[#2A2526] placeholder-[#7D7273] focus:outline-none focus:border-[#6B5B95] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7D7273] hover:text-[#2A2526]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Condition Filter & Availability Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Condition Filter Segmented Control */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#2A2526]/10 text-xs">
            {(['All', 'Stamped Copy', 'Pristine Copy'] as const).map((cond) => (
              <button
                key={cond}
                onClick={() => {
                  soundEngine.playTap();
                  setConditionFilter(cond);
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  conditionFilter === cond
                    ? 'bg-[#FAF7F2] text-[#2A2526] font-semibold shadow-2xs'
                    : 'text-[#7D7273] hover:text-[#2A2526]'
                }`}
              >
                {cond === 'All' ? 'All Copies' : cond}
              </button>
            ))}
          </div>

          {/* Available Only Toggle */}
          <button
            onClick={() => {
              soundEngine.playTap();
              setAvailableOnly(!availableOnly);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              availableOnly
                ? 'bg-[#EBF5EE] border-[#2E7D5B]/40 text-[#2E7D5B]'
                : 'bg-white border-[#2A2526]/10 text-[#7D7273] hover:text-[#2A2526]'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border ${availableOnly ? 'bg-[#2E7D5B] border-[#2E7D5B] text-white' : 'border-[#7D7273]'}`}>
              {availableOnly && <Check className="w-2.5 h-2.5" />}
            </span>
            <span>Available Now Only</span>
          </button>

          {/* Sort By Selector */}
          <select
            value={sortBy}
            onChange={(e) => {
              soundEngine.playTap();
              setSortBy(e.target.value as 'popularity' | 'rating' | 'availability');
            }}
            className="px-3 py-2 rounded-xl bg-white border border-[#2A2526]/10 text-xs text-[#2A2526] font-medium focus:outline-none focus:border-[#6B5B95]"
          >
            <option value="popularity">Sort by: Popularity (Rentals)</option>
            <option value="rating">Sort by: Highest Rated</option>
            <option value="availability">Sort by: Available Copies</option>
          </select>
        </div>

      </div>

      {/* Genre Filter Scrollable Tabs (Clean segmented control per anti-slop guidelines) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              soundEngine.playTap();
              setSelectedGenre(genre);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? 'bg-[#2A2526] text-[#FAF7F2] shadow-xs'
                : 'bg-white/80 border border-[#2A2526]/10 text-[#7D7273] hover:text-[#2A2526] hover:bg-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
