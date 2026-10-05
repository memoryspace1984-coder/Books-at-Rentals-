export type BookCondition = 'Stamped Copy' | 'Pristine Copy';

export type BookGenre =
  | 'All Genres'
  | 'Computer Science & Tech'
  | 'Literature & Poetry'
  | 'Psychology & Mind'
  | 'Music & Art'
  | 'Philosophy & Life';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  availabilityStatus: 'Available Now' | 'All Rented';
  expectedBackDate?: string;
  rentalCount: number;
  condition: BookCondition;
  description: string;
  pageCount: number;
  isbn: string;
  rating: number;
  language: string;
  edition: string;
  accentColor: string;
}

export interface Rental {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  coverImage: string;
  condition: BookCondition;
  rentalDate: string; // ISO
  dueDate: string; // ISO
  rentalDays: number;
  baseAmount: number; // 89
  paidAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Student Wallet';
  status: 'active' | 'returned';
  returnedDate?: string;
  lateFeeCharged?: number;
}

export interface ReadingGoal {
  monthlyTarget: number;
  month: string;
}
