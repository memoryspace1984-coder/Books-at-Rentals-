import React, { useState } from 'react';
import { Clock, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { Rental } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface MyRentalsProps {
  activeRentals: Rental[];
  pastRentals: Rental[];
  onReturnBook: (rentalId: string, lateFee: number) => void;
  onExploreCatalog: () => void;
}

export const MyRentals: React.FC<MyRentalsProps> = ({
  activeRentals,
  pastRentals,
  onReturnBook,
  onExploreCatalog,
}) => {
  const [returningRental, setReturningRental] = useState<Rental | null>(null);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string>('');

  // Fixed simulated current date: Oct 5, 2026
  const currentDate = new Date('2026-10-05T10:00:00Z');

  const calculateLateFee = (dueDateStr: string): { isOverdue: boolean; daysOverdue: number; fee: number } => {
    const dueDate = new Date(dueDateStr);
    const diffMs = currentDate.getTime() - dueDate.getTime();
    const daysOverdue = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const fee = daysOverdue * 10; // ₹10/day
    return {
      isOverdue: daysOverdue > 0,
      daysOverdue,
      fee,
    };
  };

  const handleInitiateReturn = (rental: Rental) => {
    soundEngine.playTap();
    setReturningRental(rental);
  };

  const handleConfirmReturn = () => {
    if (!returningRental) return;
    const { fee } = calculateLateFee(returningRental.dueDate);
    soundEngine.playPaymentChime();
    onReturnBook(returningRental.id, fee);
    setReturnSuccessMsg(`"${returningRental.bookTitle}" successfully returned! Reading goal track updated.`);
    setReturningRental(null);

    setTimeout(() => {
      setReturnSuccessMsg('');
    }, 4500);
  };

  return (
    <div className="space-y-8">
      {/* Return Success Notification Banner */}
      {returnSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#EBF5EE] border border-[#2E7D5B]/30 text-[#2E7D5B] text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{returnSuccessMsg}</span>
        </div>
      )}

      {/* Active Physical Rentals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#2A2526]">
              My Active Physical Rentals
            </h2>
            <p className="text-xs text-[#7D7273]">
              Physical copies currently in your hands. Track due dates and fine timers.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#2A2526]/10 text-[#2A2526]">
            {activeRentals.length} Active Copies
          </span>
        </div>

        {activeRentals.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-[#2A2526]/10 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#7D7273]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#2A2526]">
                No Books Currently Rented
              </h3>
              <p className="text-xs text-[#7D7273] max-w-sm mx-auto mt-1">
                Your shelf is currently quiet. Pick any physical book from our catalog for just ₹89 for 7 days.
              </p>
            </div>
            <button
              onClick={() => {
                soundEngine.playTap();
                onExploreCatalog();
              }}
              className="px-5 py-2.5 rounded-full bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold shadow-xs"
            >
              Browse Physical Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRentals.map((rental) => {
              const { isOverdue, daysOverdue, fee } = calculateLateFee(rental.dueDate);
              const dueDateObj = new Date(rental.dueDate);
              const formattedDueDate = dueDateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={rental.id}
                  className="bg-white rounded-2xl border border-[#2A2526]/10 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={rental.coverImage}
                      alt={rental.bookTitle}
                      className="w-20 h-28 object-cover rounded-xl border border-[#2A2526]/10 shadow-xs shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            rental.condition === 'Stamped Copy'
                              ? 'bg-[#F3EFFB] text-[#6B5B95]'
                              : 'bg-[#EBF5EE] text-[#2E7D5B]'
                          }`}
                        >
                          {rental.condition}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-base text-[#2A2526] leading-snug">
                        {rental.bookTitle}
                      </h4>
                      <p className="text-xs text-[#7D7273]">by {rental.bookAuthor}</p>

                      <div className="pt-2 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[#7D7273]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due Date: <strong className="text-[#2A2526]">{formattedDueDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#7D7273]">
                          <span>Paid: <strong className="text-[#2A2526] font-mono">₹{rental.paidAmount}</strong> via {rental.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Late Fine Rule Status Box */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/10 flex items-center justify-between text-xs">
                    {isOverdue ? (
                      <div className="flex items-center gap-2 text-[#D9822B]">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <div>
                          <span className="font-bold">Overdue by {daysOverdue} days!</span>
                          <span className="block text-[10px] font-mono">Late fee: ₹{fee} (@ ₹10/day)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#2E7D5B]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <div>
                          <span className="font-bold">On Rhythm (Zero Fine)</span>
                          <span className="block text-[10px] text-[#7D7273]">Return by {formattedDueDate} to avoid ₹10/day</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleInitiateReturn(rental)}
                      className="px-3 py-1.5 rounded-lg bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Return Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Rentals History */}
      {pastRentals.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#2A2526]/10">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#2A2526]">
              Past Returned Copies ({pastRentals.length})
            </h3>
            <span className="text-xs text-[#7D7273]">Contributing to your monthly reading goals</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#2A2526]/10 divide-y divide-[#2A2526]/5 overflow-hidden">
            {pastRentals.map((rental) => (
              <div key={rental.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={rental.coverImage}
                    alt={rental.bookTitle}
                    className="w-10 h-14 object-cover rounded shadow-2xs"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-[#2A2526]">{rental.bookTitle}</h5>
                    <p className="text-[#7D7273]">by {rental.bookAuthor} · {rental.condition}</p>
                    <span className="text-[11px] text-[#2E7D5B] font-medium">
                      Returned on {rental.returnedDate ? new Date(rental.returnedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Logged'}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[#2A2526] font-bold">₹{rental.paidAmount}</div>
                  <div className="text-[11px] text-[#2E7D5B]">Completed ✓</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return Modal Confirmation */}
      {returningRental && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#2A2526]/10 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#2A2526]">
                Confirm Book Return
              </h3>
              <button
                onClick={() => setReturningRental(null)}
                className="text-[#7D7273] hover:text-[#2A2526]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#2A2526]/10 space-y-2 text-xs">
              <div className="font-semibold text-sm text-[#2A2526]">{returningRental.bookTitle}</div>
              <p className="text-[#7D7273]">by {returningRental.bookAuthor}</p>
              
              <div className="pt-2 border-t border-[#2A2526]/10 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7D7273]">Condition check:</span>
                  <span className="font-semibold text-[#6B5B95]">{returningRental.condition} verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7D7273]">Accumulated late fee:</span>
                  <span className="font-mono font-bold text-[#2E7D5B]">
                    ₹{calculateLateFee(returningRental.dueDate).fee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7D7273]">Dorm drop/box:</span>
                  <span>Campus Library Drop Box #3</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#7D7273]">
              Confirming return will instantly restore this physical copy to the library circulation and advance your monthly Reading Goal track!
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReturningRental(null)}
                className="px-4 py-2 text-xs font-semibold text-[#7D7273] hover:text-[#2A2526]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-5 py-2.5 rounded-full bg-[#2A2526] hover:bg-[#2E7D5B] text-white text-xs font-semibold shadow-xs"
              >
                Confirm Return & Sync Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
