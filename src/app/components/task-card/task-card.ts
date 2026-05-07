import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItem } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: false,
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  @Input() task!: TaskItem;

  @Output() edit = new EventEmitter<TaskItem>();
  @Output() close = new EventEmitter<TaskItem>();

  onEdit() {
    this.edit.emit(this.task);
  }

  onClose() {
    this.close.emit(this.task);
  }

}
