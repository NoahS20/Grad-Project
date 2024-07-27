import { AfterViewChecked, ElementRef, Component, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { AutoResizeDirective } from '../directives/auto-resize.directive';
import { fileTransferring } from '../file-transfer.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../api.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';

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
  firstTime = true;
  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;
  showConfirmDialog = false;
  confirmMessage = '';
  confirmResolve!: (result: boolean) => void;
  question_uploaded = false

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
      }, 9125);
    }
  }

  confirmQuestionText(textarea: HTMLTextAreaElement) : void{
      this.confirmDialog('Would like to send this answer and select a question file for this answer?').then(result => {
        if (result) {
          alert('Upload a question')
          this.openQuestionDialog();
          this.sendMessage(textarea);
        }
    });
  }

  openQuestionDialog() {
    var questionInput = document.getElementById("questionInput");
    if (questionInput) {
      questionInput.click();
    }
    this.question_uploaded = true;
  }

  respond(message: any): void {
    // Simulate a bot response
    setTimeout(() => {
      console.log(message);
      this.messages.push({ text: message, user: false });
      this.scrollToBottom();
    }, 1000);
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if(this.firstTime == true){
      this.messages.push({ text: 'Please read! You can upload a question and answer by clicking the paperclip button or you can type the answer first and then choose a question!', user: false });
      this.firstTime = false;
    }
  }

  ngOnInit() {
    this.subscription = this.dataService.currentData.subscribe(data => {
      this.message = data;  // Could be text or Base64 data
      this.respondFile(this.message);
    });

    this.subscription = this.dataService.question.subscribe(data => {
      this.message = data;
      this.respondQuestion(this.message)
    });
  }

  ngQuestionOnInit(){
    console.log("Step")
    this.subscription = this.dataService.question.subscribe(data => {
      this.message = data;
      this.respondQuestion(this.message)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEnterKeyPress(event: any, textarea: HTMLTextAreaElement){
    event.preventDefault();
    this.confirmDialog('Would like to send this answer and select question for this answer?').then(result => {
      if (result) {
        alert('Upload a question')
        this.openQuestionDialog();
        this.sendMessage(textarea);
      }
    });
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
    console.log(file)
    this.sendFile(file);
  }

  respondQuestion(file: File): void {
    console.log("recieved question");
    console.log(file)
    this.sendQuestion(file)
  }

  sendData(data:any): any {
    this.apiService.postData(data).subscribe(response => {
      console.log(response);
      this.respond(response.Verdict)
      return response;
    });
  }

  sendQuestion(fileSend:File): any {
    if (fileSend) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Content = base64.split(',')[1];  // Remove the data URL part
        this.apiService.upload_question(fileSend!.name, base64Content).subscribe(
          response => {
            console.log('Question uploaded successfully ', response);
            this.respond(response.Result)
          },
          error => {
            console.error('Error uploading question ', error);
          }
        );
      };
      reader.readAsDataURL(fileSend);
    } else {
      console.error('No question selected ');
    }
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
            this.respond(response.Verdict)
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

  confirmDialog(message: string): Promise<boolean> {
    this.confirmMessage = message;
    this.showConfirmDialog = true;
    return new Promise<boolean>((resolve) => {
      this.confirmResolve = resolve;
    });
  }

  handleConfirm(result: boolean): void {
    this.showConfirmDialog = false;
    this.confirmResolve(result);
  }



}
