import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskItem } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskStateService {

  private tasksSubject = new BehaviorSubject<TaskItem[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  setTasks(tasks: TaskItem[]) {
    this.tasksSubject.next(tasks);
  }

  addTask(task: TaskItem) {
    const current = this.tasksSubject.value;
    this.tasksSubject.next([...current, task]);
  }

  updateTask(updated: TaskItem) {
    const current = this.tasksSubject.value;

    this.tasksSubject.next(
      current.map(t =>
        t.id === updated.id ? updated : t
      )
    );
  }
}