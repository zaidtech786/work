import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketManagementComponent } from './ticket-management/ticket-management';

const routes: Routes = [
    { path: '', redirectTo: 'tickets', pathMatch: 'full' },
    { path: 'tickets', component: TicketManagementComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupportRoutingModule { }
