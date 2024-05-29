import { Component, viewChild } from '@angular/core';
import { AutoResizeDirective } from '../directives/auto-resize.directive';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent {
  messages: any[] = [];
  inputMessage: string = '';

  constructor() { }

  sendMessage(textarea: HTMLTextAreaElement): void {
    if (this.inputMessage.trim()) {
      this.messages.push({ text: this.inputMessage, user: true });
      this.respond(this.inputMessage);
      this.inputMessage = '';  // Fixed typo here
      textarea.style.height = '38px';  // Adjust this value to match your default size
    }
  }

  respond(message: string): void {
    // Simulate a bot response
    setTimeout(() => {
      this.messages.push({ text: 'Echo: ' + message, user: false });
    }, 1000);
  }

}
