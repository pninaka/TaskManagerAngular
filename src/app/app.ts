import { Component, OnInit, signal } from '@angular/core';
import { TaskItem } from './models/task.model';
import { TaskService } from './services/taskService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from './components/task-form/task-form';
import { Observable } from 'rxjs';
import { TaskStateService } from './services/taskStateService';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  // protected readonly title = signal('TaskManager-UI');
  tasks$!: Observable<TaskItem[]>;

  constructor(
    private taskService: TaskService,
    private taskState: TaskStateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.tasks$ = this.taskState.tasks$;
  }

  ngOnInit(): void {
    const userId = this.taskState.currentUserId;
    this.taskService.getUserTasks(userId).subscribe((tasks) => {
      this.taskState.setTasks(tasks);
    });
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '600px',
      height: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskState.addTask(result);
      }
    });
  }
  editTask(taskToEdit: any) {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '500px',
      data: { task: taskToEdit }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskState.updateTask(result);
      }
    });
  }
  closeTask(task: TaskItem) {
    this.taskService.closeTask(task.id, task).subscribe({
      next: (res) => {
        this.taskState.updateTask(res); 
        this.snackBar.open('המשימה נסגרה בהצלחה!', 'הבנתי', {
          duration: 3000,
        });

      },
        error: (err) => {
          console.error('Error updating task', err);
          const errorMessage = err.error?.message || 'אירעה שגיאה בעדכון המשימה. נסה שוב.';
          this.snackBar.open(errorMessage, 'הבנתי', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },

    })};

  parseCustomData(jsonString?: string): any {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  }
}
