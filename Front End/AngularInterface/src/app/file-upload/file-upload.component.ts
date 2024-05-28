import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileContent: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result;
    };
    reader.readAsText(file);  // Adjust this method based on the file type, e.g., readAsDataURL for images
  }
}
