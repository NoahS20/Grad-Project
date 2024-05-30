import { AfterViewChecked, ElementRef, Component, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { AutoResizeDirective } from '../directives/auto-resize.directive';
import { fileTransferring } from '../file-transfer.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked{
  loading = false;
  messages: any[] = [];
  inputMessage: string = '';
  message: any;
  subscription: Subscription = new Subscription;
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  constructor(
    private dataService: fileTransferring,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  sendMessage(textarea: HTMLTextAreaElement): void {
    this.loading = true;
    this.scrollToBottom();
    if (this.inputMessage.trim()) {
      setTimeout(() => {
        this.messages.push({ text: this.inputMessage, user: true });
        this.respond(this.inputMessage);
        this.inputMessage = '';  // Fixed typo here
        textarea.style.height = '38px';  // Adjust this value to match your default size
        this.loading = false;
      }, 1500);
    }
  }

  respond(message: string): void {
    // Simulate a bot response
    setTimeout(() => {
      this.messages.push({ text: 'Echo: ' + message, user: false });
      this.scrollToBottom();
    }, 1000);
    this.scrollToBottom();
  }

  respondFile(file: File): void {
    console.log("success");
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
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

  onEnterKeyPress(event: any, textarea: HTMLTextAreaElement){
    event.preventDefault();
    this.sendMessage(textarea);
}

  scrollToBottom(): void {
    if (typeof window !== "undefined") {
      console.log(window.scrollY);
      console.log(document.body.scrollHeight)
      if (window.scrollY > 0) {
        if(window.scrollY >= document.body.scrollHeight){
          window.scrollTo(0,document.body.scrollHeight + window.scrollY);
        }
        else{
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    }
  }

}
