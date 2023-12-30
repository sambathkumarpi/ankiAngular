import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'http://localhost:3000/api/subjects';

  constructor(private http: HttpClient) {}

  getSubjects(subjectId?: number): Observable<any[]> {
    const url = subjectId ? `${this.apiUrl}/${subjectId}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  addSubject(subjectName: string): Observable<any> {
    const body = { name: subjectName };
    return this.http.post<any>(this.apiUrl, body);
  }

  deleteSubject(subjectId: number): Observable<void> {
    const url = `${this.apiUrl}/${subjectId}`;
    return this.http.delete<void>(url);
  }
}
