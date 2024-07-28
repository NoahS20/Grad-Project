// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class fileTransferring {
  private dataSource = new BehaviorSubject<any>("");  // Can be string or any other data type
  private questionSource = new BehaviorSubject<any>("");  // Can be string or any other data type
  currentData = this.dataSource.asObservable();
  question = this.questionSource.asObservable();
  constructor() { }

  fileTransfer(file: File) {
    this.dataSource.next(file);
    console.log('File transferred:', file);  // Debugging log
  }

  questionTransfer(file: File){
    this.questionSource.next(file);
    console.log('Question transferred:', file);  // Debugging log
  }

}
