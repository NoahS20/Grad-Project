import { Component, ViewChild, ElementRef } from '@angular/core';
import { fileTransferring } from '../file-transfer.service';

interface FileContent {
  name: string;
  content: string | ArrayBuffer | null;
}
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {
  constructor(private fileT: fileTransferring) {}
  fileContent: string | ArrayBuffer | null = null;
  questionContent: string | ArrayBuffer | null = null;
  @ViewChild('questionInput', { static: false }) questionInput!: ElementRef;
  maxFiles = 2;
  fileContents: FileContent[] = [];
  verdict = false
  showConfirmDialog = false;
  confirmMessage = '';
  confirmResolve!: (result: boolean) => void;
  filename: string[] = []
  questionindex = 0;
  answerIndex = 0;


  onFileSelected(event: any): void {
    const file: File = event.target.files[1];
    if (file) {
      this.readFile(file);
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    const totalFiles = this.fileContents.length + files.length;
    if (totalFiles > this.maxFiles) {
      alert(`You can only upload a maximum of ${this.maxFiles} files.`);
    }

    else{
      this.parseFiles(files);
      this.confirmDialog('Do you want to send the files?').then(result => {
        if (result) {
          this.readQuestion(files[this.questionindex]);
          this.readFile(files[this.answerIndex]);
        }
      });
    }
  }

  parseFiles(files: FileList): void{
    Array.from(files).forEach(file => {
      this.filename.push(file.name);
    });
    if(this.filename[0].includes('question')){
      this.questionindex = 0;
      this.answerIndex = 1
    }
    else{
      this.questionindex = 1;
      this.answerIndex = 0
    }
    this.filename.pop()
    this.filename.pop()
  }

  onQuestionSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readQuestion(file);
    }
  }

  private readFile(file: File): void {
    this.fileT.fileTransfer(file);
    // Adjust this method based on the file type, e.g., readAsDataURL for images
  }

  private readQuestion(file: File): void {
    this.fileT.questionTransfer(file);
    // Adjust this method based on the file type, e.g., readAsDataURL for images
  }

  confirmQuestionFile() : void{
    this.confirmDialog('Do you want to upload a question file?').then(result => {
      if (result) {
        this.openQuestionDialog();
      }
    });
  }

  openQuestionDialog() {
    this.questionInput.nativeElement.click();
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
