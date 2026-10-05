import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolarPermit } from '../../models/permit.model';

@Component({
  selector: 'app-permit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg border shadow-sm p-3 hover:shadow-md transition-shadow">
      <div class="font-mono text-xs text-gray-500 mb-1">#{{ permit().jobNumber }}</div>
      <div class="font-medium text-gray-900">{{ permit().address }}</div>
      <div class="text-xs text-gray-500">{{ permit().borough }}, {{ permit().zipCode }}</div>
      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="text-gray-600">{{ permit().contractor }}</span>
        <span class="font-mono">{{ permit().systemSizeKw }} kW</span>
      </div>
      @if (permit().pendingSync) {
        <div class="mt-2 flex items-center gap-1 text-xs text-orange-600">
          <span class="animate-pulse">●</span> Syncing...
        </div>
      }
      <div class="mt-2 text-xs text-gray-400">Submitted: {{ permit().submittedDate | date:'shortDate' }}</div>
    </div>
  `,
  styles: []
})
export class PermitCardComponent {
  permit = input.required<SolarPermit()>();
}