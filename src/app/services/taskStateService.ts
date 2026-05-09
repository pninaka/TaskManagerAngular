import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskItem } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskStateService {
currentUserId= 1;
  private tasksSubject = new BehaviorSubject<TaskItem[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  setTasks(tasks: TaskItem[]) {
    this.tasksSubject.next(tasks);
  }

  addTask(task: TaskItem) {
    const current = this.tasksSubject.value;
    if (task.assignedUserId !== this.currentUserId) {
    this.tasksSubject.next(current.filter(t => t.id !== task.id));
    console.log(`Task ${task.id} removed from view - reassigned to user ${task.assignedUserId}`);
  } 
  else {
     this.tasksSubject.next([...current, task]);
  }
   
  }

  updateTask(updated: TaskItem) {
    const current = this.tasksSubject.value;

  if (updated.assignedUserId !== this.currentUserId) {
    this.tasksSubject.next(current.filter(t => t.id !== updated.id));
    console.log(`Task ${updated.id} removed from view - reassigned to user ${updated.assignedUserId}`);
  } 
  else {
    this.tasksSubject.next(
      current.map(t => t.id === updated.id ? updated : t)
    );
  }
  }
}