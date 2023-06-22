import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  messages: Message[] = [];

  constructor(private messageServive: MessageService) {}

  // onAddMessage(message: Message) {
  //   this.messages.push(message);
  // }

  ngOnInit(): void {
    this.messages = this.messageServive.getMessages();
    this.messageServive.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    )
    this.subscription = this.messageServive.messageListChangedEvent.subscribe(
      (messagesList: Message[]) => {
        this.messages = messagesList;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
