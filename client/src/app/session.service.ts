// session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSessionData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/test-sessions`);
  }

  createSession(subjectId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/test-sessions`, { subject_id: subjectId });
  }

  updateSessionEndTime(sessionId: number, endTime: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/test-sessions/${sessionId}`, { end_time: endTime });
  }
}
