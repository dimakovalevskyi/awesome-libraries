import { Book } from './book';

export class Library {
  id: number;
  name: string;
  address: string;
  coordinates: {
    latitude: number,
    longitude: number
  };
  books: Array<Book>;
}
