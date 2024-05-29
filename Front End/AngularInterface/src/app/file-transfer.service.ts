// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class fileTransferring {
  private dataSource = new BehaviorSubject<any>("");  // Can be string or any other data type
  currentData = this.dataSource.asObservable();

  constructor() { }

  fileTransfer(file: File) {
    this.dataSource.next(file);
  }
}
