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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }
/*
  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result;
    };
    reader.readAsText(file);
    this.fileT.fileTransfer(file);
    // Adjust this method based on the file type, e.g., readAsDataURL for images
  }
  */

  private readFile(file: File): void {
    this.fileT.fileTransfer(file);
    // Adjust this method based on the file type, e.g., readAsDataURL for images
  }


}
