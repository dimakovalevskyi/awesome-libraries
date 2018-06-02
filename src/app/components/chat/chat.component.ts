import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Library } from '../../models/library';
import { Book } from '../../models/book';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat: any = [{
    author: 'bot',
    type: 'text',
    content: 'Привіт! Я твій персональний бот для пошуку книг. \
    Нажаль в мого автора не було достатньо часу щоб наділити мене \
    хоч якимось штучним інтелектом, тому я не розумніший за аналітика :('
  }, {
    author: 'bot',
    type: 'text',
    content: 'Проте ти можеш все рівно попросити мене знайти книгу, для цього просто \
    напиши будь-яку інформацію про книгу, наприклад автора, назву або ж ISBN книги.'
  }, {
    author: 'bot',
    type: 'text',
    content: 'Сподіваюсь ми зрозуміємо один одного.'
  }];
  currentMessage = '';
  state = 'search';

  constructor(
    private service: ChatService
  ) { }

  addHumanText(text: string) {
    this.chat.push({
      author: 'human',
      type: 'text',
      content: text
    });
  }

  addBotText(text: string) {
    this.chat.push({
      author: 'bot',
      type: 'text',
      content: text
    });
  }

  send() {
    this.currentMessage = this.currentMessage.trim();
    if (!this.currentMessage.length) {
      return;
    }
    this.addHumanText(this.currentMessage);
    this.service.search(this.currentMessage)
      .then(result => {
        this.state = 'select';
        this.addBotText('Ось що мені вдалося знайти за твоїм запитом:');
        this.chat.push({
          author: 'bot',
          type: 'variants',
          content: result
        });
      })
      .catch(error => this.addBotText(error.message));
    this.currentMessage = '';
  }

  showOnMap(lib: Library) {
    this.service.showOnMap(lib);
  }

  isBookAvailable(book: Book) {
    return book.copies.filter(copy => copy.returnDate <= new Date().getTime()).length >= 1;
  }

  getAvailableDate(book: Book) {
    const soonestReturnDate =
      book.copies.reduce((prevMin, copy) => copy.returnDate < prevMin ? copy.returnDate : prevMin, book.copies[0].returnDate);
    const date = new Date(soonestReturnDate);

    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  select(variant: {book: Book, library: Library}) {
    this.service.take(variant)
      .then(details => {
        this.chat.pop();
        this.addHumanText(variant.book.name);
        this.addBotText('Дякую, що користуєшся нашим сервісом.');
        this.addBotText('Покажи цей QR-код співробітнику бібліотеки щоб отимати книгу.');
        this.chat.push({
          author: 'bot',
          type: 'image',
          content: details
        });
        this.chat.push({
          author: 'bot',
          type: 'map',
          content: variant.library
        });
        this.state = 'search';
      });
  }

  ngOnInit() {
  }

}
