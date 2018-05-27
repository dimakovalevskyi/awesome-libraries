export class Book {
  name: string;
  author: string;
  year: number;
  isbn: string;
  coverUrl: string;
  getStatus: Function;
  copies: Array<{
    getStatus: Function;
    returnDate: number;
  }>;
}
