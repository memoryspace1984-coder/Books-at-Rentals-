import React, { useState } from 'react';
import { Disc3, Volume2, Sparkles, CheckCircle2, BookOpen, Clock, Music, Sliders, Play, RotateCcw } from 'lucide-react';
import { Rental } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface ReadingGoalsProps {
  activeRentals: Rental[];
  pastRentals: Rental[];
  monthlyTarget: number;
  onUpdateTarget: (newTarget: number) => void;
  onExploreCatalog: () => void;
}

export const ReadingGoals: React.FC<ReadingGoalsProps> = ({
  activeRentals,
  pastRentals,
  monthlyTarget,
  onUpdateTarget,
  onExploreCatalog,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(monthlyTarget);

  const completedCount = pastRentals.length;
  const inProgressCount = activeRentals.length;
  const totalAccounted = completedCount + inProgressCount;
  const progressPercent = Math.min(100, Math.round((completedCount / monthlyTarget) * 100));

  const handleSaveTarget = () => {
    soundEngine.playTap();
    onUpdateTarget(tempTarget);
    setIsEditingTarget(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#2A2526]/10 p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Header: Title and Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2526]/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3EFFB] border border-[#6B5B95]/30 flex items-center justify-center text-[#6B5B95] shadow-xs">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#2A2526]">
                Reading Rhythm & Goals
              </h2>
              <span className="text-xs font-mono text-[#6B5B95] bg-[#F3EFFB] px-2 py-0.5 rounded-full border border-[#6B5B95]/20">
                Lo-Fi Track
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7D7273] mt-0.5">
              Syncing your physical book rentals with your monthly reading frequency.
            </p>
          </div>
        </div>

        {/* Target Stepper/Selector */}
        <div className="flex items-center gap-3 bg-[#FAF7F2] p-2 rounded-2xl border border-[#2A2526]/10 self-start sm:self-auto">
          {isEditingTarget ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7D7273] pl-2 font-medium">Target:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={tempTarget}
                onChange={(e) => setTempTarget(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 px-2 py-1 rounded-lg bg-white border border-[#6B5B95] text-xs font-mono font-bold text-center"
              />
              <button
                onClick={handleSaveTarget}
                className="px-3 py-1 rounded-lg bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold shadow-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-2">
              <div className="text-left">
                <span className="text-[10px] text-[#7D7273] uppercase font-mono block">Monthly Target</span>
                <span className="text-xs font-bold text-[#2A2526]">
                  Goal: Read {monthlyTarget} physical books
                </span>
              </div>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setTempTarget(monthlyTarget);
                  setIsEditingTarget(true);
                }}
                className="p-1.5 rounded-lg text-[#7D7273] hover:text-[#6B5B95] hover:bg-white transition-colors"
                title="Adjust monthly target"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Track Equalizer & Audio Volume Slider Visualization */}
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#6B5B95]/20 space-y-6">
        
        {/* Equalizer Waveform & Channel Strips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B5B95] flex items-center gap-1.5">
              <Disc3 className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Track Visualization: {completedCount} of {monthlyTarget} Completed</span>
            </span>
            <span className="text-xs font-mono tabular-nums text-[#2A2526] font-semibold">
              {progressPercent}% Frequencies Mastered
            </span>
          </div>

          {/* Equalizer Channel Columns (one for each book up to monthlyTarget) */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 h-28 items-end p-4 bg-white rounded-xl border border-[#2A2526]/10">
            {Array.from({ length: Math.max(monthlyTarget, totalAccounted) }).map((_, idx) => {
              const bookNumber = idx + 1;
              const isCompleted = idx < completedCount;
              const isInProgress = !isCompleted && idx < totalAccounted;
              const isPending = !isCompleted && !isInProgress;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end h-full gap-1 group relative cursor-pointer"
                  title={
                    isCompleted
                      ? `Book #${bookNumber}: Returned & Finished ♪`
                      : isInProgress
                      ? `Book #${bookNumber}: Currently in Active Rentals (In Progress)`
                      : `Book #${bookNumber}: Remaining track in your monthly goal`
                  }
                >
                  {/* Frequency Level Bar */}
                  <div
                    className={`w-full rounded-md transition-all duration-500 relative overflow-hidden ${
                      isCompleted
                        ? 'h-full bg-gradient-to-t from-[#2E7D5B] to-[#57B885] shadow-xs'
                        : isInProgress
                        ? 'h-3/5 bg-gradient-to-t from-[#6B5B95] to-[#E0859D] animate-pulse'
                        : 'h-1/5 bg-[#FAF7F2] border border-[#2A2526]/15 group-hover:h-1/3'
                    }`}
                  >
                    {/* Equalizer LED segments */}
                    <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 opacity-40 pointer-events-none">
                      <div className="w-full h-0.5 bg-black/30" />
                      <div className="w-full h-0.5 bg-black/30" />
                      <div className="w-full h-0.5 bg-black/30" />
                      <div className="w-full h-0.5 bg-black/30" />
                    </div>
                  </div>

                  {/* Channel Number */}
                  <span className="text-[10px] font-mono text-[#7D7273]">
                    {isCompleted ? '✓' : isInProgress ? '♫' : bookNumber}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Equalizer Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-[#7D7273]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#2E7D5B]" />
              <span>Successfully Returned ({completedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#6B5B95]" />
              <span>Active Rental in Progress ({inProgressCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#FAF7F2] border border-[#2A2526]/20" />
              <span>Remaining Goal ({Math.max(0, monthlyTarget - completedCount)})</span>
            </div>
          </div>
        </div>

        {/* Audio Volume / Fader Slider Style Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-[#2A2526]/10">
          <div className="flex justify-between text-xs text-[#2A2526] font-semibold">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#6B5B95]" />
              <span>Master Volume Fader (Goal Completion):</span>
            </span>
            <span className="font-mono">{completedCount} / {monthlyTarget} Physical Books</span>
          </div>

          {/* Master Fader Bar with Vintage Volume Ticks */}
          <div className="relative h-6 bg-white rounded-lg border border-[#2A2526]/15 overflow-hidden flex items-center px-1">
            {/* Filled Volume Track */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#6B5B95] via-[#E0859D] to-[#2E7D5B] transition-all duration-700 opacity-80"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Vintage Volume Notch Marks */}
            <div className="absolute inset-0 flex justify-between items-center px-3 pointer-events-none z-10 opacity-30">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="w-0.5 h-3 bg-black" />
              ))}
            </div>

            {/* Slider Knob Icon indicator */}
            <div
              className="absolute top-1 bottom-1 w-3 bg-[#2A2526] rounded-xs shadow-md z-20 transition-all duration-700"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[#7D7273]">
            <span>0 dB (Beginning)</span>
            <span>+3 dB (Halfway mark)</span>
            <span>+6 dB (Goal Achieved!)</span>
          </div>
        </div>

      </div>

      {/* Breakdown Cards: Active Rentals vs Returned Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Active Rentals in Track */}
        <div className="p-4 rounded-2xl bg-white border border-[#2A2526]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D9822B]" />
              <h3 className="font-bold text-sm text-[#2A2526]">Active Rental Tracks</h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FDF3E1] text-[#D9822B]">
              {activeRentals.length} Currently Reading
            </span>
          </div>

          {activeRentals.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#7D7273] space-y-2">
              <p>No physical books currently circulating in your dorm.</p>
              <button
                onClick={onExploreCatalog}
                className="text-xs text-[#6B5B95] font-semibold underline hover:text-[#2A2526]"
              >
                Rent a book for ₹89 to spin a new track →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {activeRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={rental.coverImage}
                      alt={rental.bookTitle}
                      className="w-8 h-11 object-cover rounded shadow-xs shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-[#2A2526] truncate">{rental.bookTitle}</div>
                      <div className="text-[11px] text-[#7D7273]">
                        Due {new Date(rental.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#6B5B95]/10 text-[#6B5B95] whitespace-nowrap">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Successfully Returned */}
        <div className="p-4 rounded-2xl bg-white border border-[#2A2526]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
              <h3 className="font-bold text-sm text-[#2A2526]">Successfully Returned</h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#EBF5EE] text-[#2E7D5B]">
              {pastRentals.length} Mastered & Logged
            </span>
          </div>

          {pastRentals.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#7D7273]">
              Return your active rentals once finished to log them here and boost your reading volume!
            </div>
          ) : (
            <div className="space-y-2">
              {pastRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={rental.coverImage}
                      alt={rental.bookTitle}
                      className="w-8 h-11 object-cover rounded shadow-xs shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-[#2A2526] truncate">{rental.bookTitle}</div>
                      <div className="text-[11px] text-[#2E7D5B]">
                        Returned {rental.returnedDate ? new Date(rental.returnedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2E7D5B]/10 text-[#2E7D5B] whitespace-nowrap">
                    +1 Goal Track
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
