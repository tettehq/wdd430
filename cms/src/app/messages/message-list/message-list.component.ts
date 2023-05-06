import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Announcement', 'All CIT students are to take note that, full-stack development is awesome!', 'Bro. Jackson'),
    new Message('2', 'Due dates', 'WHat are the due dates for the two projects for this semester?', 'John Doe'),
    new Message('3', 'Internship', 'BANDAI NAMCO has made available positions for internship this summmer. Interested students should reach out to me.', 'Bro. Barzee')
  ]

  constructor() {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
