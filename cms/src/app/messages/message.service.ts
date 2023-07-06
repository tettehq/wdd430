import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { ContactService } from '../contacts/contact.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageSelectedEvent = new EventEmitter<Message>();

  messageChangedEvent = new EventEmitter<Message[]>();

  messageListChangedEvent = new Subject<any>();

  maxMessageId: number;

  localUrl: string = 'http://localhost:3000/messages/';

  firebaseUrl: string = 'https://wdd430-project1-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient, private contactService: ContactService) {
    // this.messages = MOCKMESSAGES
    this.maxMessageId = this.getMaxId();
  }

  getMessages() {
    // return this.messages.slice();
    this.contactService.getContacts();
    this.http.get<{message: string, messages: Message[]}>(this.localUrl).subscribe(
      (response: {message: string, messages: Message[]}) => {
        this.messages = response.messages;
        this.maxMessageId = this.getMaxId();
        // this.messages.sort((a, b) => (a.id > b.id ? 1 : b.id ? -1 : 0));
        this.messageListChangedEvent.next(this.messages.slice());
        console.log(this.messages);
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

  addMessage(newMessage: Message) {
    // this.messages.push(message);
    // this.messageListChangedEvent.next(this.storeMessages());

    if (!newMessage) {
      return;
    }

    // make sure id of the new Message is empty
    newMessage.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, newMessage: Message }>(this.localUrl,
      newMessage,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.newMessage);
          console.log(responseData.newMessage)
          this.sortAndSend();
        }
      );
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

  sortAndSend() {
    if (Array.isArray(this.messages)) {
      // this.messages.sort((a, b) =>
      //   a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      // );
      this.messageListChangedEvent.next(this.messages.slice());
    }
  }


  // storeMessages() {
  //   const data = JSON.stringify(this.messages);
  //   return this.http.put(
  //     'https://wdd430-project1-default-rtdb.firebaseio.com/messages.json',
  //     data,
  //     {
  //       headers: new HttpHeaders({'Content-Type': 'application/json'})
  //     }).subscribe(
  //       () => {
  //         this.messageListChangedEvent.next(this.messages.slice());
  //       }
  //     )
  // }
}
