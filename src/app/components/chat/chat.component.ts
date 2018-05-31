import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat = [{
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

  constructor() { }

  send() {
    this.currentMessage = this.currentMessage.trim();
    if (!this.currentMessage.length) {
      return;
    }
    this.chat.push({
      author: 'human',
      type: 'text',
      content: this.currentMessage
    });
    this.currentMessage = '';
    // get response
  }

  ngOnInit() {
  }

}
