import { Component, input, output, CdkDropList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PermitCardComponent } from '../permit-card/permit-card.component';
import { SolarPermit, PermitStatus } from '../../models/permit.model';

const STATUS_LABELS: Record<PermitStatus, string> = {
  submitted: 'Submitted',
  approved: 'Approved',
  scheduled: 'Scheduled',
  installed: 'Installed',
  closed: 'Closed',
};

const STATUS_COLORS: Record<PermitStatus, string> = {
  submitted: 'bg-gray-100 border-gray-300',
  approved: 'bg-blue-50 border-blue-200',
  scheduled: 'bg-yellow-50 border-yellow-200',
  installed: 'bg-green-50 border-green-200',
  closed: 'bg-purple-50 border-purple-200',
};

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, PermitCardComponent],
  template: `
    <div
      class="flex flex-col min-w-[300px] max-w-[320px] rounded-lg border"
      [class]="STATUS_COLORS[status()]"
      cdkDropList
      [id]="'column-' + status()"
      [cdkDropListConnectedTo]="connectedTo()"
      (cdkDropListDropped)="drop.emit($event)"
    >
      <div class="p-3 border-b font-semibold text-gray-800 flex justify-between items-center">
        <span>{{ STATUS_LABELS[status()] }}</span>
        <span class="px-2 py-0.5 text-xs bg-white rounded-full">{{ permits().length }}</span>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-2">
        @for (permit of permits(); track permit.id) {
          <app-permit-card [permit]="permit" cdkDrag></app-permit-card>
        }
        @if (permits().length === 0) {
          <div class="text-center text-gray-400 py-8 text-sm">No permits</div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class KanbanColumnComponent {
  status = input.required<PermitStatus>();
  permits = input.required<SolarPermit[]>();
  connectedTo = input.required<string[]>();
  drop = output<CdkDropList>();

  protected STATUS_LABELS = STATUS_LABELS;
  protected STATUS_COLORS = STATUS_COLORS;
}