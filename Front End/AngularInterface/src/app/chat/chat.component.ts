import { AfterViewChecked, ElementRef, Component, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { AutoResizeDirective } from '../directives/auto-resize.directive';
import { fileTransferring } from '../file-transfer.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements AfterViewChecked{
  loading = false;
  filedata: any;
  messages: any[] = [];
  inputMessage: string = '';
  message: any;
  subscription: Subscription = new Subscription;
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  constructor(
    private dataService: fileTransferring,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) {}

  sendMessage(textarea: HTMLTextAreaElement): void {
    this.loading = true;
    this.scrollToBottom();
    if (this.inputMessage.trim()) {
      setTimeout(() => {
        this.messages.push({ text: this.inputMessage, user: true });
        this.sendData(this.inputMessage);
        this.inputMessage = '';  // Fixed typo here
        textarea.style.height = '38px';  // Adjust this value to match your default size
        this.loading = false;
      }, 2000);
    }
  }

  respond(message: any): void {
    // Simulate a bot response
    setTimeout(() => {
      this.messages.push({ text: 'Echo: ' + message, user: false });
      this.scrollToBottom();
    }, 1000);
    this.scrollToBottom();
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

  respondFile(file: File): void {
    console.log("success");
    this.sendFile(file);
  }

  sendData(data:any): any {
    //const payload = { message: 'Hello from Angular!' };
    this.apiService.postData(data).subscribe(response => {
      console.log(response);
      this.respond(response)
      return response;
    });

    this.apiService.getData().subscribe(dataGrab => {
      console.log(dataGrab);
      this.respond(dataGrab)
      return dataGrab;
    });
  }

  sendFile(fileSend:File): any {
    if (fileSend) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Content = base64.split(',')[1];  // Remove the data URL part
        this.apiService.upload_file(fileSend!.name, base64Content).subscribe(
          response => {
            console.log('File uploaded successfully', response);
            this.respond(response)
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
      };
      reader.readAsDataURL(fileSend);
    } else {
      console.error('No file selected');
    }
  }

}
