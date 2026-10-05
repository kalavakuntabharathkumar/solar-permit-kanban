import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PermitStore } from '../../store/permit.store';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { PermitStatus, STATUS_ORDER } from '../../models/permit.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, KanbanColumnComponent],
  template: `
    <div class="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
      @for (status of statuses; track status) {
        <app-kanban-column
          [status]="status"
          [permits]="permitsByStatus()[status]"
          (drop)="onDrop($event, status)"
          [connectedTo]="connectedIds"
        ></app-kanban-column>
      }
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .cdk-drag-preview { box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
    .cdk-drag-placeholder { opacity: 0.3; background: #e5e7eb; }
  `]
})
export class KanbanBoardComponent {
  private store = inject(PermitStore);
  statuses = STATUS_ORDER;
  connectedIds = STATUS_ORDER.map((s) => `column-${s}`);
  permitsByStatus = this.store.permitsByStatus;

  constructor() {
    effect(() => this.store.loadPermits());
  }

  onDrop(event: CdkDragDrop<any[]>, targetStatus: PermitStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const permit = event.previousContainer.data[event.previousIndex];
    if (permit.status === targetStatus) return;

    this.store.optimisticUpdate(permit.id, targetStatus);
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.store.updateStatus({ id: permit.id, status: targetStatus });
  }
}