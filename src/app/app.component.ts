import { Component } from '@angular/core';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KanbanBoardComponent],
  template: `
    <header class="bg-blue-900 text-white p-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">PermitFlow - NYC Solar Permits</h1>
        <div class="flex gap-2">
          <button (click)="refresh()" class="px-3 py-1 bg-blue-700 rounded hover:bg-blue-600" [disabled]="loading">
            {{ loading ? 'Syncing...' : 'Refresh' }}
          </button>
          <span class="px-2 py-1 text-sm" [class.text-green-300]="online" [class.text-red-300]="!online">
            {{ online ? 'Online' : 'Offline' }}
          </span>
        </div>
      </div>
    </header>
    <main class="p-4">
      <app-kanban-board></app-kanban-board>
    </main>
  `,
  styles: []
})
export class AppComponent {
  loading = false;
  online = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => (this.online = true));
    window.addEventListener('offline', () => (this.online = false));
  }

  async refresh() {
    this.loading = true;
    try {
      await window.dispatchEvent(new CustomEvent('permits:refresh'));
    } finally {
      this.loading = false;
    }
  }
}