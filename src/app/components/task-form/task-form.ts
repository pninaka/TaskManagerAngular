import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/taskService';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;

  statuses: any[] = [];
  dynamicFields: any[] = [];
  allUsers: any[] = [];
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskForm>,
    @Inject(MAT_DIALOG_DATA) public data: any, // אם תרצי להעביר נתונים לתוך המודאל
  ) {
    this.taskForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: [1, Validators.required], // 1 = טכני כברירת מחדל
      currentStatus: [null],
      assignedUserId: [null],
      customData: [{}],
    });
  }
  ngOnInit(): void {
    const taskType = this.data && this.data.task ? this.data.task.type : 1;

    forkJoin({
      users: this.taskService.getUsers(),
      statuses: this.taskService.getStatusDefinitions(taskType),
    }).subscribe(({ users, statuses }) => {
      this.allUsers = users;
      this.statuses = statuses;

      if (this.data && this.data.task) {
        this.loadDynamicFields(this.data.task.currentStatus);

        const taskData = { ...this.data.task };

        let customDataObj = {};

        if (typeof taskData.customDataJson === 'string' && taskData.customDataJson) {
          customDataObj = JSON.parse(taskData.customDataJson);
        } else if (taskData.customData) {
          customDataObj = taskData.customData;
        }

        this.isEditMode = true;

        this.taskForm.patchValue({
          id: taskData.id,
          title: taskData.title,
          description: taskData.description,
          currentStatus: Number(taskData.currentStatus),
          assignedUserId: taskData.assignedUserId,
          type: taskData.type,
          customData: customDataObj,
        });

        this.taskForm.get('type')?.disable();
      }
    });
  }

  onSave() {
    const taskData = this.taskForm.getRawValue();
    console.log('taskData', taskData);
    // המרת customData לאובייקט JSON לפני השליחה
    // const taskToSend = {
    //   ...taskData,
    //   customData: JSON.stringify(taskData.customData || {}),
    // };

    if (this.isEditMode) {
      this.taskService.updateTask(taskData.id, taskData).subscribe({
        next: (res) => {
          console.log('Update success!', res);
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Error updating task', err);
          const errorMessage = err.error?.message || 'אירעה שגיאה בעדכון המשימה. נסה שוב.';
          this.snackBar.open(errorMessage, 'הבנתי', {
            duration: 5000,
            panelClass: ['error-snackbar'], 
          });
        },
      });
    } else {
      if (this.taskForm.valid) {
        const taskDataTocreate = {
          ...taskData,
          createdByUserId: 1,
          currentStatus: 1,
        };

        this.taskService.createTask(taskDataTocreate).subscribe({
          next: (res: any) => {
            this.dialogRef.close(res);
          },
          error: (err: any) => console.error('Error creating task', err),
        });
      }
    }
  }
  onStatusChange(newStatusId: number) {
    this.loadDynamicFields(newStatusId);
  }

  loadDynamicFields(statusId: number) {
    // במערכת אמיתית, אפשר לשלוף את זה מה-DB. כרגע נעשה את זה לפי לוגיקה פשוטה:
    const taskType = this.data?.task?.type || this.taskForm.get('type')?.value || 1;

    if (taskType === 1 && statusId === 2) {
      this.dynamicFields = [
        { key: 'price1', label: 'הצעת מחיר א', type: 'number' },
        { key: 'price2', label: 'הצעת מחיר ב', type: 'number' },
        { key: 'vendor', label: 'שם ספק', type: 'text' },
      ];
    } else if (taskType === 1 && statusId === 3) {
      this.dynamicFields = [{ key: 'receipt', label: 'קבלות', type: 'string' }];
    } else if (taskType === 2 && statusId === 2) {
      this.dynamicFields = [{ key: 'SpecificationText', label: 'תיאור התיקון', type: 'string' }];
    } else if (taskType === 2 && statusId === 3) {
      this.dynamicFields = [{ key: 'BranchName', label: 'BranchName', type: 'string' }];
    } else if (taskType === 2 && statusId === 4) {
      this.dynamicFields = [{ key: 'VersionNumber', label: 'מספר גרסה', type: 'number' }];
    } else {
      this.dynamicFields = [];
    }
  }
  updateCustomData(key: string, value: any) {
    const currentData = this.taskForm.get('customData')?.value || {};
    // מעדכנים רק את השדה הספציפי
    currentData[key] = value;
    // מעדכנים את הטופס חזרה
    this.taskForm.patchValue({ customData: currentData });
    console.log('Updated Custom Data:', currentData);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
