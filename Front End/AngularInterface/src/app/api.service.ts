import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:5000/api/data';  // Flask URL
  private fileUrl = 'https://localhost:5000/api/upload';
  //private apiUrl = 'http://localhost:8000/api/data';  // Django URL

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  postData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, JSON.stringify(data), { headers });
  }

  upload_file(fileName: string, fileContent: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = { fileName: fileName, fileContent: fileContent };
    return this.http.post<any>(this.fileUrl, JSON.stringify(data), { headers });
  }
}
