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

  scrollToBottom(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollContainer) {
      const element = this.scrollContainer.nativeElement;
      const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      console.log(atBottom);
      console.log(window.scrollY);
      if (atBottom && window.scrollY != 0) {
        // Only scroll to the bottom if the user is already at the bottom
        if (typeof window !== "undefined") {
          window.scrollTo(0,document.body.scrollHeight);
        }
      }
    }
  }

}
