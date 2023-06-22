import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageSelectedEvent = new EventEmitter<Message>();

  messageChangedEvent = new EventEmitter<Message[]>();

  messageListChangedEvent = new Subject<any>();

  maxMessageId: number;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES
    this.maxMessageId = this.getMaxId();
  }

  getMessages() {
    // return this.messages.slice();
    this.http.get<Message[]>('https://wdd430-project1-default-rtdb.firebaseio.com/messages.json').subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => (a.id > b.id ? 1 : b.id ? -1 : 0));
        this.messageListChangedEvent.next(this.messages.slice());
        console.log(typeof(this.messages));
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
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
    this.messageListChangedEvent.next(this.storeMessages())
  }

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach(
      (message: Message) => {
        const currentId = +message.id;
        if (currentId > maxId) {
          maxId = currentId
        }
      }
    )
    return maxId;
  }

  storeMessages() {
    const data = JSON.stringify(this.messages);
    return this.http.put(
      'https://wdd430-project1-default-rtdb.firebaseio.com/messages.json',
      data,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }).subscribe(
        () => {
          this.messageListChangedEvent.next(this.messages.slice());
        }
      )
  }
}
