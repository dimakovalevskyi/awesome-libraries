import { Book } from './book';

export class Library {
  id: number;
  name: string;
  address: string;
  coordinates: LibraryCoordinates;
  books: Array<Book>;
}

export class LibraryCoordinates {
  latitude: number;
  longitude: number;
}
