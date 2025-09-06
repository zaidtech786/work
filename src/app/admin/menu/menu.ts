import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class MenuComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  searchQuery = '';

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
