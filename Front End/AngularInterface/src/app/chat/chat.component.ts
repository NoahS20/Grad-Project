import { Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { AutoResizeDirective } from '../directives/auto-resize.directive';
import { fileTransferring } from '../file-transfer.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  inputMessage: string = '';
  message: any;
  subscription: Subscription = new Subscription;

  constructor(private dataService: fileTransferring) {}


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

  respondFile(file: File): void {
    console.log("success");
  }

  ngOnInit() {
    this.subscription = this.dataService.currentData.subscribe(data => {
      this.message = data;  // Could be text or Base64 data
      this.respondFile(this.message);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
