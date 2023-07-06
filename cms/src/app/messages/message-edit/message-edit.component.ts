import { Component, ViewChild, ElementRef} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText', {static: true}) msgText: ElementRef;
  // @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender: string = '101';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;

    const newMessage = new Message(
      null, '1', subjectValue, msgTextValue, this.currentSender
    )

    // this.addMessageEvent.emit(message);

    this.messageService.addMessage(newMessage);

    this.onClear();
  }

  onClear() {
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }

}
