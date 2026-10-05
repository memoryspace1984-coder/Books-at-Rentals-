import { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Structure & Algorithms for Thinkers',
    author: 'Prof. Ananya Sen & David R. Klein',
    genre: 'Computer Science & Tech',
    coverImage: '/src/assets/images/book_cover_algorithms_1791219980450.jpg',
    totalCopies: 5,
    availableCopies: 3,
    availabilityStatus: 'Available Now',
    rentalCount: 48,
    condition: 'Stamped Copy',
    description: 'The premier university reference for mastering core data structures, graph theory, and algorithmic complexity with intuitive geometric visual models.',
    pageCount: 684,
    isbn: '978-0-13-468599-1',
    rating: 4.9,
    language: 'English',
    edition: '3rd Campus Edition',
    accentColor: '#4A7C59',
  },
  {
    id: 'book-2',
    title: 'Gentle Habits & Quiet Mornings',
    author: 'Mira Takahashi',
    genre: 'Psychology & Mind',
    coverImage: '/src/assets/images/book_cover_gentle_rhythm_1791219992018.jpg',
    totalCopies: 6,
    availableCopies: 4,
    availabilityStatus: 'Available Now',
    rentalCount: 67,
    condition: 'Pristine Copy',
    description: 'A comforting behavioral psychology journey exploring microscopic habits, low-dopamine study rituals, and how gentle consistency outperforms burnout.',
    pageCount: 312,
    isbn: '978-1-52-476313-8',
    rating: 4.8,
    language: 'English',
    edition: '1st Illustrated Edition',
    accentColor: '#E0859D',
  },
  {
    id: 'book-3',
    title: 'Midnights in Tokyo: A Vinyl Odyssey',
    author: 'Kenji Arisawa',
    genre: 'Literature & Poetry',
    coverImage: '/src/assets/images/book_cover_tokyo_melodies_1791220002668.jpg',
    totalCopies: 4,
    availableCopies: 0,
    availabilityStatus: 'All Rented',
    expectedBackDate: 'Oct 14, 2026',
    rentalCount: 52,
    condition: 'Stamped Copy',
    description: 'An atmospheric coming-of-age novel set in late-night Shimokitazawa jazz kissa cafes, following an exchange student seeking an elusive rare press record.',
    pageCount: 290,
    isbn: '978-0-38-554596-9',
    rating: 4.7,
    language: 'English',
    edition: 'Paperback Original',
    accentColor: '#6B5B95',
  },
  {
    id: 'book-4',
    title: 'The Architecture of Music & Mind',
    author: 'Dr. Oliver V. Vance',
    genre: 'Music & Art',
    coverImage: '/src/assets/images/book_cover_music_cognition_1791220013562.jpg',
    totalCopies: 5,
    availableCopies: 2,
    availabilityStatus: 'Available Now',
    rentalCount: 39,
    condition: 'Pristine Copy',
    description: 'How harmonic resonance, acoustic frequency, and rhythmic entrainment rewire human memory, focus, and emotional memory banks.',
    pageCount: 420,
    isbn: '978-0-26-203892-7',
    rating: 4.9,
    language: 'English',
    edition: 'Hardcover Edition',
    accentColor: '#D9822B',
  },
  {
    id: 'book-5',
    title: 'Meditations on Everyday Solitude',
    author: 'Elena Rostova',
    genre: 'Philosophy & Life',
    coverImage: '/src/assets/images/book_cover_gentle_rhythm_1791219992018.jpg',
    totalCopies: 4,
    availableCopies: 1,
    availabilityStatus: 'Available Now',
    rentalCount: 31,
    condition: 'Stamped Copy',
    description: 'Modern stoicism and eastern stillness parsed for college students navigating career anxieties and academic overwhelm.',
    pageCount: 248,
    isbn: '978-0-14-312774-1',
    rating: 4.6,
    language: 'English',
    edition: 'Library Clothbound',
    accentColor: '#8C7A6B',
  },
  {
    id: 'book-6',
    title: 'Designing with Sound: Lo-Fi UX',
    author: 'Samira Patel & Liam Vance',
    genre: 'Music & Art',
    coverImage: '/src/assets/images/book_cover_music_cognition_1791220013562.jpg',
    totalCopies: 3,
    availableCopies: 0,
    availabilityStatus: 'All Rented',
    expectedBackDate: 'Oct 18, 2026',
    rentalCount: 44,
    condition: 'Pristine Copy',
    description: 'Explores acoustic micro-interactions, haptic feedback design, and calming sonic interfaces for calm modern software.',
    pageCount: 336,
    isbn: '978-1-49-195438-6',
    rating: 4.8,
    language: 'English',
    edition: 'Design Series Vol. 2',
    accentColor: '#6B5B95',
  },
  {
    id: 'book-7',
    title: 'Distributed Systems & Cloud Patterns',
    author: 'Marcus Lindholm',
    genre: 'Computer Science & Tech',
    coverImage: '/src/assets/images/book_cover_algorithms_1791219980450.jpg',
    totalCopies: 5,
    availableCopies: 3,
    availabilityStatus: 'Available Now',
    rentalCount: 56,
    condition: 'Stamped Copy',
    description: 'Consensus algorithms, event-driven streaming architectures, and fault tolerance paradigms explained through practical engineering case studies.',
    pageCount: 512,
    isbn: '978-1-49-204071-2',
    rating: 4.9,
    language: 'English',
    edition: '2nd University Edition',
    accentColor: '#2E7D5B',
  },
  {
    id: 'book-8',
    title: 'The Poetry of Late Trains',
    author: 'Hana K. Mori',
    genre: 'Literature & Poetry',
    coverImage: '/src/assets/images/book_cover_tokyo_melodies_1791220002668.jpg',
    totalCopies: 4,
    availableCopies: 2,
    availabilityStatus: 'Available Now',
    rentalCount: 28,
    condition: 'Pristine Copy',
    description: 'Short lyrical poems capturing the transition between campus lectures, suburban commute trains, and dim library study lamps.',
    pageCount: 160,
    isbn: '978-0-81-122956-2',
    rating: 4.7,
    language: 'English',
    edition: 'Poetry Chapbook',
    accentColor: '#E0859D',
  },
];

export const INITIAL_USER_RENTALS: {
  activeRentals: Array<{
    id: string;
    bookId: string;
    bookTitle: string;
    bookAuthor: string;
    coverImage: string;
    condition: 'Stamped Copy' | 'Pristine Copy';
    rentalDate: string;
    dueDate: string;
    rentalDays: number;
    baseAmount: number;
    paidAmount: number;
    paymentMethod: 'UPI' | 'Card' | 'Student Wallet';
    status: 'active';
  }>;
  pastRentals: Array<{
    id: string;
    bookId: string;
    bookTitle: string;
    bookAuthor: string;
    coverImage: string;
    condition: 'Stamped Copy' | 'Pristine Copy';
    rentalDate: string;
    dueDate: string;
    returnedDate: string;
    rentalDays: number;
    baseAmount: number;
    paidAmount: number;
    lateFeeCharged: number;
    paymentMethod: 'UPI' | 'Card' | 'Student Wallet';
    status: 'returned';
  }>;
} = {
  activeRentals: [
    {
      id: 'rental-demo-1',
      bookId: 'book-5',
      bookTitle: 'Meditations on Everyday Solitude',
      bookAuthor: 'Elena Rostova',
      coverImage: '/src/assets/images/book_cover_gentle_rhythm_1791219992018.jpg',
      condition: 'Stamped Copy',
      rentalDate: '2026-10-02T10:00:00Z',
      dueDate: '2026-10-09T10:00:00Z',
      rentalDays: 7,
      baseAmount: 89,
      paidAmount: 89,
      paymentMethod: 'Student Wallet',
      status: 'active',
    },
  ],
  pastRentals: [
    {
      id: 'rental-demo-2',
      bookId: 'book-2',
      bookTitle: 'Gentle Habits & Quiet Mornings',
      bookAuthor: 'Mira Takahashi',
      coverImage: '/src/assets/images/book_cover_gentle_rhythm_1791219992018.jpg',
      condition: 'Pristine Copy',
      rentalDate: '2026-09-20T10:00:00Z',
      dueDate: '2026-09-27T10:00:00Z',
      returnedDate: '2026-09-26T14:30:00Z',
      rentalDays: 7,
      baseAmount: 89,
      paidAmount: 89,
      lateFeeCharged: 0,
      paymentMethod: 'UPI',
      status: 'returned',
    },
  ],
};
