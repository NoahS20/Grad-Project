import { Component } from '@angular/core';
import { fileTransferring } from '../file-transfer.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  constructor(private fileT: fileTransferring) {}
  fileContent: string | ArrayBuffer | null = null;
  questionContent: string | ArrayBuffer | null = null;


  onFileSelected(event: any): void {
    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
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

}
