import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import en from '@angular/common/locales/en';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';

type TicketStatus = 'Processing' | 'Raised' | 'Resolved' | 'Rejected';
registerLocaleData(en);

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  templateUrl: './ticket-management.html',
  styleUrls: ['./ticket-management.scss'],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzDrawerModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzPaginationModule
  ]
})
export class TicketManagementComponent implements OnInit {
  tickets:any[] = [];
  ticketForm!: FormGroup;
  selectedTicket: any = null;
  ticketHistory: any[] = [];
  counts$!: Observable<Record<TicketStatus, number>>;

  filters: any = { status: '', ticketRefId: '', dateRange: [] };
  filterBy: string = 'all';
  isDrawerVisible = false;

  pageIndex = 1;
  pageSize = 10;

  drawerWidth: string | number = 800;

  constructor(
    // private ticketService: TicketService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      ticketRefId: [''],
      title: [''],
      description: [''],
      category: [''],
      subCategory: [''],
      status: ['Raised'],
      remark: ['']
    });

    this.updateDrawerWidth();

    const today = new Date();
    this.filters = { status: '', ticketRefId: '', dateRange: [today, today] };

    // this.counts$ = this.ticketService.getTicketCounts();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDrawerWidth();
  }

  updateDrawerWidth() {
    this.drawerWidth = window.innerWidth < 768 ? '100%' : 800;
  }

  getPopupContainer = (trigger: HTMLElement): HTMLElement => {
    return trigger.parentElement as HTMLElement;
  };

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }

  applyFilter(): void {
    const appliedFilters: any = {};

    if (this.filters.dateRange && this.filters.dateRange.length === 2) {
      appliedFilters.startDate = this.formatDate(this.filters.dateRange[0]);
      appliedFilters.endDate = this.formatDate(this.filters.dateRange[1]);
    }

    if (this.filters.status && this.filters.status.toLowerCase() !== 'all') {
      appliedFilters.status = this.filters.status;
    }

    if (this.filters.ticketRefId) {
      appliedFilters.ticketRefId = this.filters.ticketRefId;
    }

    // this.ticketService.getTicketsWithFilter(appliedFilters).subscribe({
    //   next: (data: Ticket[]) => {
    //     if (!data || data.length === 0) {
    //       this.message.error('No data found!');
    //     }
    //     this.tickets = data.sort(
    //       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //     );
    //   },
    //   error: () => this.message.error('Something went wrong while fetching data!')
    // });
  }

  resetFilters(): void {
    const today = new Date();
    this.filters = { status: '', ticketRefId: '', dateRange: [today, today] };
    this.filterBy = 'all';
    this.applyFilter();
  }

  openDrawer(ticket: any): void {
    this.selectedTicket = ticket;
    this.ticketHistory = ticket.history || [];
    this.ticketForm.patchValue(ticket);
    this.isDrawerVisible = true;
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.selectedTicket = null;
    this.ticketForm.reset();
  }

  saveTicket(): void {
    if (!this.selectedTicket || this.ticketForm.invalid) return;

    const updatedTicket = {
      ...this.selectedTicket,
      ...this.ticketForm.value,
      updatedAt: new Date() // <-- set updated date
    };

    const historyEntry = {
      updatedBy: 'Support Team',
      status: updatedTicket.status,
      remark: updatedTicket.remark,
      updatedAt: new Date()
    };

    this.ticketHistory.push(historyEntry);
    updatedTicket.history = this.ticketHistory;

    // this.ticketService.updateTicket(updatedTicket.ticketRefId, updatedTicket).subscribe({
    //   next: () => {
    //     const index = this.tickets.findIndex(
    //       (t) => t.ticketRefId === updatedTicket.ticketRefId
    //     );
    //     if (index !== -1) {
    //       this.tickets[index] = { ...updatedTicket };
    //     }
    //     this.counts$ = this.ticketService.getTicketCounts();
    //     this.closeDrawer();
    //   },
    //   error: (err) => console.error('Error updating ticket:', err)
    // });
  }


  onPageIndexChange(index: number): void {
    this.pageIndex = index;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
  }
}