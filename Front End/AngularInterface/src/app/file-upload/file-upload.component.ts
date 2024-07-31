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

  triggerFileInput(event: Event) {
    alert('Please upload a question file that has the word question in its name and a answer file with any name.');
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onQuestionSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if(this.parseFile(file)){
        this.questionInput.nativeElement.value = '';
        this.readQuestion(file);
      }
    }
    this.onFileChange()
  }

  onFilesSelected(event: any): void {
    const files: any = event.target.files;
    console.log(files)
    const totalFiles = this.fileContents.length + files.length;
    if (totalFiles > this.maxFiles) {
      alert(`You can only upload a maximum of ${this.maxFiles} files.`);
    }
    else if(totalFiles == 1){
      alert('Error: Only one file selected. Please select two files')
    }
    else{
      if(this.parseFiles(files)){
        if(this.fileNames === undefined || this.fileNames.length == 0){
          this.popAll();
          alert('Error: None of the files are answer files. Files submitted are all question files')
        }
        else{
          this.confirmDialog('Do you want to send the chosen files: ' + this.questionFileNames[0] + " " + this.fileNames[0]).then(result => {
            if (result) {
              this.readQuestion(this.questionFiles[0]);
              this.readFile(this.answerFiles[0]);
            }
            this.popAll();
          });
        }
      }
      else{
        alert('Error: None of the files have the word question in it. Please upload a question file that has the word question in it');
        this.popAll();
      }
    }
    this.onFileChange()
  }

  popAll(){
    while (this.questionFileNames.length > 0 || this.questionFiles.length > 0 || this.answerFiles.length > 0 || this.fileNames.length > 0) {
      this.questionFileNames.pop();
      this.fileNames.pop();
      this.answerFiles.pop();
      this.questionFiles.pop();
    }
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
    if(this.questionFileNames === undefined || this.questionFileNames.length == 0 ){
      console.log(this.questionFileNames)
      console.log(this.fileNames);
      console.log("Answer files names: " + this.fileNames)
      console.log("Answer files: " + this.answerFiles)
      return false
    }
    else{
      console.log("Question file names: " + this.questionFileNames)
      console.log("Question files: " + this.questionFiles)
      return true
    }
  }

  parseFile(file: File): boolean{
    if (file.name.toLowerCase().includes('question')) {
      this.questionFileNames.push(file.name);
      this.questionFiles.push(file)
     }
    if(this.questionFileNames === undefined || this.questionFileNames.length == 0){
      alert('Error: None of the files have the word question in it. Please upload a question file that has the word question in it');
      this.questionFileNames.pop();
      this.questionFiles.pop();
      return false
    }
    else{
      return true
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
