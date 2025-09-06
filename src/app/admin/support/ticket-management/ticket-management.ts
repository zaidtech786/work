import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';

// ng-zorro standalone imports used in template
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
    selector: 'app-ticket-management',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzCardModule,
        NzTableModule,
        NzSelectModule,
        NzDatePickerModule,
        NzButtonModule,
        NzInputModule,
        NzDropDownModule,
        NzEmptyModule
    ],
    templateUrl: './ticket-management.html',
    styleUrls: ['./ticket-management.scss'],
})
export class TicketManagementComponent implements OnInit {
    stats: any = {};
    listOfData: any[] = [];
    loading = false;
    filterForm: FormGroup;
    pageIndex = 1;
    pageSize = 10;
    total = 0;

    filterByOptions = [
        { value: 'all', label: 'All' },
        { value: 'status', label: 'Status' },
        { value: 'refId', label: 'Ref ID' }
    ];

    statuses = ['Processing', 'Raised', 'Resolved', 'Rejected'];

    constructor(private ticketService: TicketService, private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            filterBy: ['all'],
            status: [null],
            refId: [''],
            dateRange: [null]
        });
    }

    ngOnInit(): void {
        this.fetchStats();
        this.loadData();
    }

    fetchStats(): void {
        this.ticketService.getStats().subscribe((res: any) => (this.stats = res));
    }

    loadData(page = 1): void {
        this.loading = true;
        const f = this.filterForm.value;
        const payload: any = {
            page,
            limit: this.pageSize
        };

        if ((f.filterBy === 'status' || f.filterBy === 'all') && f.status) payload.status = f.status;
        if ((f.filterBy === 'refId' || f.filterBy === 'all') && f.refId) payload.refId = f.refId;
        if (f.dateRange && f.dateRange.length === 2) {
            payload.startDate = f.dateRange[0]?.toISOString();
            payload.endDate = f.dateRange[1]?.toISOString();
        }

        this.ticketService.getTickets(payload).subscribe(
            (res: any) => {
                this.listOfData = res.items || [];
                this.total = res.total || 0;
                this.loading = false;
            },
            () => (this.loading = false)
        );
    }

    search(): void {
        this.loadData(1);
    }

    clear(): void {
        this.filterForm.reset({ filterBy: 'all', status: null, refId: '' });
        this.loadData(1);
    }

    nzPageIndexChange(idx: number): void {
        this.pageIndex = idx;
        this.loadData(idx);
    }
}
