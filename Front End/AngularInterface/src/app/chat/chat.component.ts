import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: any[] = [];
  inputMessage: string = '';

  constructor() { }

  sendMessage(): void {
    if (this.inputMessage.trim()) {
      this.messages.push({ text: this.inputMessage, user: true });
      this.respond(this.inputMessage);
      this.inputMessage = '';  // Fixed typo here
    }
  }

  respond(message: string): void {
    // Simulate a bot response
    setTimeout(() => {
      this.messages.push({ text: 'Echo: ' + message, user: false });
    }, 1000);
  }
}
