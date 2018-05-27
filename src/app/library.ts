import { Book } from './book';

export interface Library {
  name: string;
  address: string;
  coordinates: any;
  books: Array<Book>;
}
