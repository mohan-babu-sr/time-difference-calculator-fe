import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all records from MongoDB
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Get a record by date
  getByDate(date: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filter?date=${date}`);
  }

  // Add a new record to MongoDB
  addData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  // Update a record in MongoDB
  updateData(updatedData: any) {
    return this.http.put(`${this.apiUrl}/${updatedData._id}`, updatedData);
  }

  // Delete a record from MongoDB
  deleteData(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
