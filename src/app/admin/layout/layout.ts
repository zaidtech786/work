import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../menu/menu';
import { SideNavComponent } from '../side-nav/side-nav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MenuComponent, SideNavComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
