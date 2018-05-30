export class Book {
  name: string;
  author: string;
  year: number;
  isbn: string;
  coverUrl: string;
  copies: Array<{
    returnDate: number;
  }>;
}
