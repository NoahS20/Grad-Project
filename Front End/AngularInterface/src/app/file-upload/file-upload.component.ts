import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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

export class FileUploadComponent{
  constructor(private fileT: fileTransferring) {}
  fileContent: string | ArrayBuffer | null = null;
  questionContent: string | ArrayBuffer | null = null;
  @ViewChild('questionInput', { static: false }) questionInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  maxFiles = 2;
  fileContents: FileContent[] = [];
  verdict = false
  showConfirmDialog = false;
  confirmMessage = '';
  confirmResolve!: (result: boolean) => void;
  fileNames: string[] = []
  questionFileNames: string[] = []
  questionFiles: File[] = [];
  answerFiles: File[] = []

  onFileChange() {
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[1];
    if (file) {
      this.readFile(file);
    }
  }

  onFilesSelected(event: any): void {
    const files: any = event.target.files;
    console.log(files)
    const totalFiles = this.fileContents.length + files.length;
    if (totalFiles > this.maxFiles) {
      alert(`You can only upload a maximum of ${this.maxFiles} files.`);
    }

    else{
      alert('Please upload a question file that has the word question in it');
      if(this.parseFiles(files)){
        this.confirmDialog('Do you want to send the chosen files?').then(result => {
          if (result) {
            this.readQuestion(this.questionFiles[0]);
            this.readFile(this.answerFiles[0]);
          }
          this.questionFileNames.pop();
          this.fileNames.pop();
          this.answerFiles.pop();
          this.questionFiles.pop();
        });
      }
      else{
        alert('Error: None of the files ahd the word question in it. Please upload a question file that has the word question in it');
      }
    }
    this.onFileChange()
  }

  parseFiles(files: FileList): boolean{
    console.log(files)
    Array.from(files).forEach(file => {
      console.log(file.name)
      if (file.name.toLowerCase().includes('question')) {
        this.questionFileNames.push(file.name);
        this.questionFiles.push(file)
      } else {
        this.fileNames.push(file.name);
        this.answerFiles.push(file)
      }
    });
    if(this.questionFileNames === undefined || this.questionFileNames.length == 0 || this.fileNames === undefined || this.fileNames.length == 0 ){
      console.log(this.questionFileNames)
      console.log(this.fileNames);
      this.questionFileNames.pop();
      this.fileNames.pop();
      this.answerFiles.pop();
      this.questionFiles.pop();
      return false
    }
    else{
      return true
    }
  }

  onQuestionSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readQuestion(file);
    }
    this.onFileChange()
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
