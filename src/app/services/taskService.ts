import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusDefinition, TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = ' https://localhost:7122/api/task';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }
  getUserTasks(userId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/user/${userId}`);
  }
  getStatusDefinitions(typeId: number): Observable<StatusDefinition[]> {
    return this.http.get<StatusDefinition[]>(`${this.apiUrl}/flow/${typeId}`);
  }
    getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
  createTask(task: Partial<TaskItem>): Observable<TaskItem> {
    console.log('Creating task with data:', task);
    return this.http.post<TaskItem>(this.apiUrl, task);
  }
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }
  closeTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/closeTask/${id}`, task);
  }
}
