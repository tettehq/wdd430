import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];

  messageSelectedEvent = new EventEmitter<Message>();

  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    // for (let i = 0; i < this.messages.length; i++) {
    //   if (this.messages[i].id == id) {
    //     return this.messages[i]
    //   }
    // }
    // return null

    return this.messages.find(message => message.id = id)
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice())
  }
}
