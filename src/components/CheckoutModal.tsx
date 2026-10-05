import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Music,
  Info,
  Disc3,
  HelpCircle,
} from 'lucide-react';
import { Book, BookCondition, Rental } from '../types/book';
import { soundEngine } from '../utils/audioPlayer';

interface CheckoutModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onRentalSuccess: (rental: Rental) => void;
  studentWalletBalance: number;
  onDeductWallet: (amount: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  book,
  isOpen,
  onClose,
  onRentalSuccess,
  studentWalletBalance,
  onDeductWallet,
}) => {
  // Calculator state: Default 7 days (Base Rental Tier: 7 days for ₹89)
  const [rentalDays, setRentalDays] = useState<number>(7);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Hostel Block B, Room 304, Campus South');
  const [selectedPayment, setSelectedPayment] = useState<'Student Wallet' | 'UPI' | 'Card'>('Student Wallet');
  
  // Payment gateway mockup fields
  const [upiId, setUpiId] = useState<string>('student@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('842');

  // Interactive flow states: 'calculate' -> 'payment' -> 'animating_note' -> 'success'
  const [checkoutStep, setCheckoutStep] = useState<'calculate' | 'payment' | 'animating_note' | 'success'>('calculate');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Financial calculations
  const BASE_PRICE = 89;
  const BASE_DAYS = 7;
  const LATE_FEE_RATE = 10; // ₹10/day
  const extraDays = Math.max(0, rentalDays - BASE_DAYS);
  const lateFineAccumulated = extraDays * LATE_FEE_RATE;
  const totalPrice = BASE_PRICE + lateFineAccumulated;

  // Return date calculation (assuming starting from today: Oct 5, 2026)
  const today = new Date('2026-10-05T10:00:00Z');
  const returnDate = new Date(today);
  returnDate.setDate(returnDate.getDate() + rentalDays);
  const formattedReturnDate = returnDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleProceedToPayment = () => {
    soundEngine.playTap();
    setErrorMsg('');
    setCheckoutStep('payment');
  };

  const handleConfirmPayment = () => {
    if (selectedPayment === 'Student Wallet' && studentWalletBalance < totalPrice) {
      setErrorMsg('Insufficient Student Wallet balance. Please choose UPI or Debit Card.');
      return;
    }

    setIsProcessing(true);
    soundEngine.playTap();

    setTimeout(() => {
      // Step to Note-sliding micro-interaction
      setCheckoutStep('animating_note');
      soundEngine.playPaymentChime();

      // Deduct wallet if used
      if (selectedPayment === 'Student Wallet') {
        onDeductWallet(totalPrice);
      }

      // Finish animation and transition to user's active library
      setTimeout(() => {
        setIsProcessing(false);
        setCheckoutStep('success');

        const newRental: Rental = {
          id: `rental-${Date.now()}`,
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          coverImage: book.coverImage,
          condition: book.condition,
          rentalDate: today.toISOString(),
          dueDate: returnDate.toISOString(),
          rentalDays: rentalDays,
          baseAmount: BASE_PRICE,
          paidAmount: totalPrice,
          paymentMethod: selectedPayment,
          status: 'active',
        };

        onRentalSuccess(newRental);
      }, 1800);
    }, 900);
  };

  const handleModalClose = () => {
    soundEngine.playTap();
    setCheckoutStep('calculate');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#2A2526]/10 overflow-hidden my-8">
        
        {/* Top Header with Lo-Fi Vinyl Ribbon */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#2A2526]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#6B5B95] text-white flex items-center justify-center text-xs">
              <Disc3 className="w-3.5 h-3.5 animate-spin-slow" />
            </span>
            <div>
              <span className="font-display font-bold text-base text-[#2A2526]">
                {checkoutStep === 'calculate' && 'Rental Terms & Dynamic Fine Calculator'}
                {checkoutStep === 'payment' && 'Mockup Payment Gateway'}
                {(checkoutStep === 'animating_note' || checkoutStep === 'success') && 'Rental Slotted Successfully'}
              </span>
              <span className="text-[11px] text-[#7D7273] block">
                Official Campus Book Rental Checkout
              </span>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#7D7273] hover:text-[#2A2526] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= STEP 1: CALCULATE & RULES ================= */}
        {checkoutStep === 'calculate' && (
          <div className="p-6 space-y-6">
            
            {/* Book Mini Banner */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#2A2526]/10">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg shadow-sm border border-[#2A2526]/10 shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#6B5B95] font-medium uppercase">
                    {book.genre}
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#2A2526] leading-snug">
                    {book.title}
                  </h4>
                  <p className="text-xs text-[#7D7273]">by {book.author}</p>
                </div>

                {/* Stamp/Condition Check Requirement */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                      book.condition === 'Stamped Copy'
                        ? 'bg-[#F3EFFB] text-[#6B5B95] border border-[#6B5B95]/30'
                        : 'bg-[#EBF5EE] text-[#2E7D5B] border border-[#2E7D5B]/30'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{book.condition}</span>
                  </div>

                  <span className="text-[11px] text-[#7D7273]">
                    {book.condition === 'Stamped Copy'
                      ? 'Official campus library stamped copy with protective sleeve.'
                      : 'Pristine untouched copy in archival condition.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Pricing Mock Calculator */}
            <div className="p-5 rounded-2xl bg-white border border-[#6B5B95]/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-[#2A2526] flex items-center gap-1.5">
                    <span>Expected Return Days Slider</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B5B95] border border-[#6B5B95]/20">
                      Transparent Pricing
                    </span>
                  </h5>
                  <p className="text-xs text-[#7D7273] mt-0.5">
                    Slide to view cost breakdown before renting.
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#2A2526] tabular-nums">
                    {rentalDays} Days
                  </span>
                  <span className="block text-[11px] text-[#7D7273]">
                    Due: {formattedReturnDate}
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="3"
                  max="28"
                  step="1"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#FAF7F2] rounded-lg appearance-none cursor-pointer accent-[#6B5B95]"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#7D7273]">
                  <span>3 Days</span>
                  <span className="font-semibold text-[#6B5B95]">7 Days (Base Tier)</span>
                  <span>14 Days</span>
                  <span>21 Days</span>
                  <span>28 Days</span>
                </div>
              </div>

              {/* Dynamic Late Fine Breakdown Table */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#2A2526]">
                  <span className="flex items-center gap-1.5">
                    <span>Base Rental Tier (1 to 7 Days):</span>
                  </span>
                  <span className="font-mono font-semibold">₹{BASE_PRICE}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[#7D7273]">
                    <span>Late Fine Rule:</span>
                    <span className="text-[10px] font-mono text-[#D9822B]">
                      {extraDays > 0 ? `${extraDays} extra days × ₹10/day` : '0 extra days'}
                    </span>
                  </span>
                  <span className={`font-mono font-semibold ${extraDays > 0 ? 'text-[#D9822B]' : 'text-[#7D7273]'}`}>
                    +₹{lateFineAccumulated}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#2E7D5B]">
                  <span>Student Deposit Waiver:</span>
                  <span className="font-mono font-semibold">₹0.00 (Zero Deposit)</span>
                </div>

                <div className="pt-2 border-t border-[#2A2526]/10 flex justify-between items-baseline font-bold text-sm text-[#2A2526]">
                  <span>Total Payable:</span>
                  <div className="text-right">
                    <span className="font-mono text-xl text-[#2A2526] tabular-nums">₹{totalPrice}</span>
                    <span className="block text-[10px] font-normal text-[#7D7273]">
                      (₹89 base {extraDays > 0 ? `+ ₹${lateFineAccumulated} late fine buffer` : ''})
                    </span>
                  </div>
                </div>
              </div>

              {/* Fine Rule Explanatory Callout */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FDF3E1] border border-[#D9822B]/20 text-[11px] text-[#8C531B]">
                <Info className="w-4 h-4 shrink-0 text-[#D9822B] mt-0.5" />
                <span>
                  <strong>Dynamic Late Fine Rule:</strong> If kept longer than 7 days, a daily late fee of ₹10/day accumulates. If you return early, any unused late buffer is instantly refunded to your Student Wallet!
                </span>
              </div>
            </div>

            {/* Delivery address input */}
            <div>
              <label className="block text-xs font-semibold text-[#2A2526] mb-1">
                Campus Delivery / Dorm Drop Location:
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2A2526]/15 text-xs text-[#2A2526] focus:outline-none focus:border-[#6B5B95]"
                placeholder="e.g. Room 204, Ramanujan Hall, Central Campus"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 text-xs font-medium text-[#7D7273] hover:text-[#2A2526]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="px-6 py-3 rounded-full bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Proceed to Payment (₹{totalPrice})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 2: PAYMENT GATEWAY MOCKUP ================= */}
        {checkoutStep === 'payment' && (
          <div className="p-6 space-y-6">
            
            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-white border border-[#2A2526]/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7D7273] block">Total Checkout Amount</span>
                <span className="font-mono text-2xl font-bold text-[#2A2526]">₹{totalPrice}</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#2A2526] font-medium block">{book.title}</span>
                <span className="text-[#7D7273]">{rentalDays} Days Rental Tier</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D7273]">
                Select Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Student Wallet */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedPayment('Student Wallet');
                    setErrorMsg('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selectedPayment === 'Student Wallet'
                      ? 'bg-[#F3EFFB] border-[#6B5B95] ring-2 ring-[#6B5B95]/20 shadow-xs'
                      : 'bg-white border-[#2A2526]/10 hover:border-[#6B5B95]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="w-5 h-5 text-[#6B5B95]" />
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B]">
                      1-Tap Pay
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#2A2526]">Student Wallet</div>
                  <div className="text-[11px] font-mono text-[#7D7273] mt-0.5">
                    Bal: ₹{studentWalletBalance}
                  </div>
                </button>

                {/* 2. UPI */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedPayment('UPI');
                    setErrorMsg('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedPayment === 'UPI'
                      ? 'bg-[#F3EFFB] border-[#6B5B95] ring-2 ring-[#6B5B95]/20 shadow-xs'
                      : 'bg-white border-[#2A2526]/10 hover:border-[#6B5B95]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-[#2E7D5B]" />
                    <span className="text-[10px] font-mono text-[#7D7273]">GPay/PhonePe</span>
                  </div>
                  <div className="text-xs font-bold text-[#2A2526]">UPI Instant</div>
                  <div className="text-[11px] text-[#7D7273] mt-0.5">Zero txn fee</div>
                </button>

                {/* 3. Debit Card */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedPayment('Card');
                    setErrorMsg('');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedPayment === 'Card'
                      ? 'bg-[#F3EFFB] border-[#6B5B95] ring-2 ring-[#6B5B95]/20 shadow-xs'
                      : 'bg-white border-[#2A2526]/10 hover:border-[#6B5B95]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-[#D9822B]" />
                    <span className="text-[10px] font-mono text-[#7D7273]">Visa/MC</span>
                  </div>
                  <div className="text-xs font-bold text-[#2A2526]">Debit Card</div>
                  <div className="text-[11px] text-[#7D7273] mt-0.5">Bank Direct</div>
                </button>
              </div>
            </div>

            {/* Selected Method Details */}
            <div className="p-4 rounded-2xl bg-white border border-[#2A2526]/10">
              {selectedPayment === 'Student Wallet' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7D7273]">Current Wallet Balance:</span>
                    <span className="font-mono font-bold text-[#2A2526]">₹{studentWalletBalance}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7D7273]">Rental Deduction:</span>
                    <span className="font-mono font-bold text-[#A63C59]">-₹{totalPrice}</span>
                  </div>
                  <div className="pt-2 border-t border-[#2A2526]/10 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#2A2526]">Balance Remaining:</span>
                    <span className="font-mono text-[#2E7D5B]">₹{studentWalletBalance - totalPrice}</span>
                  </div>
                </div>
              )}

              {selectedPayment === 'UPI' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2A2526] mb-1">
                      UPI ID (Google Pay / PhonePe / Paytm):
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/15 text-xs text-[#2A2526] focus:outline-none focus:border-[#6B5B95]"
                      placeholder="username@okhdfcbank"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] flex items-center justify-between text-[11px] text-[#7D7273]">
                    <span>Or Scan QR at door on delivery:</span>
                    <span className="font-mono font-semibold text-[#6B5B95]">Enabled</span>
                  </div>
                </div>
              )}

              {selectedPayment === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2A2526] mb-1">
                      Card Number:
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/15 text-xs font-mono text-[#2A2526] focus:outline-none focus:border-[#6B5B95]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2A2526] mb-1">Expiry:</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/15 text-xs font-mono text-[#2A2526]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2A2526] mb-1">CVV:</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#2A2526]/15 text-xs font-mono text-[#2A2526]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCheckoutStep('calculate')}
                className="px-4 py-2.5 text-xs font-medium text-[#7D7273] hover:text-[#2A2526]"
              >
                Back to Calculator
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="px-6 py-3 rounded-full bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Disc3 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{totalPrice}</span>
                    <Sparkles className="w-4 h-4 text-[#F4A8B9]" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 3: CUTE MUSICAL NOTE SLIDING MICRO-INTERACTION ================= */}
        {checkoutStep === 'animating_note' && (
          <div className="p-12 text-center space-y-6">
            
            {/* Visual Musical Slot Machine & Floating Notes */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              
              {/* Record player turntable background */}
              <div className="absolute inset-0 rounded-full vinyl-grooves animate-spin-slow opacity-90 shadow-2xl flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#E0859D] border-4 border-[#2A2526] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white" />
                </div>
              </div>

              {/* The Musical Note sliding into the slot */}
              <div className="relative z-20 animate-bounce">
                <div className="w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#6B5B95] flex flex-col items-center justify-center">
                  <span className="text-3xl text-[#6B5B95] animate-pulse">♫</span>
                  <span className="text-[10px] font-mono font-bold text-[#2A2526] mt-1">
                    SLOTTED
                  </span>
                </div>
              </div>

              {/* Floating cute notes */}
              <span className="absolute top-2 left-6 text-xl text-[#E0859D] animate-ping">♪</span>
              <span className="absolute bottom-4 right-8 text-2xl text-[#2E7D5B] animate-pulse">♩</span>
              <span className="absolute top-8 right-4 text-xl text-[#6B5B95] animate-bounce">♬</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-xl text-[#2A2526]">
                Sliding into your Active Reading Track...
              </h4>
              <p className="text-xs text-[#7D7273]">
                Payment verified. Adding physical edition to your current rentals.
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS CONFIRMATION ================= */}
        {checkoutStep === 'success' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF5EE] text-[#2E7D5B] flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-2xl text-[#2A2526]">
                Physical Book Rented!
              </h4>
              <p className="text-sm text-[#7D7273] max-w-md mx-auto">
                <strong className="text-[#2A2526]">{book.title}</strong> has been assigned to you. Your package is scheduled for dispatch to <span className="italic">{deliveryAddress}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#2A2526]/10 max-w-sm mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-[#7D7273]">Due Date:</span>
                <span className="font-mono font-semibold text-[#2A2526]">{formattedReturnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7D7273]">Condition:</span>
                <span className="font-semibold text-[#6B5B95]">{book.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7D7273]">Amount Paid:</span>
                <span className="font-mono font-semibold text-[#2E7D5B]">₹{totalPrice}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-full bg-[#2A2526] hover:bg-[#6B5B95] text-white text-xs font-semibold shadow-md transition-colors"
              >
                View in My Rentals
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
