import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
    // uses proxy.conf.json => /api will be forwarded to backend
    private base = '/api/tickets';

    constructor(private http: HttpClient) { }

    getStats(): Observable<any> {
        return this.http.get(`${this.base}/stats`);
    }

    getTickets(opts: any): Observable<any> {
        let params = new HttpParams()
            .set('page', opts.page ?? 1)
            .set('limit', opts.limit ?? 10);

        if (opts.status) params = params.set('status', opts.status);
        if (opts.refId) params = params.set('refId', opts.refId);
        if (opts.startDate) params = params.set('startDate', opts.startDate);
        if (opts.endDate) params = params.set('endDate', opts.endDate);

        return this.http.get(`${this.base}`, { params });
    }

    getTicketById(id: string) {
        return this.http.get(`${this.base}/${id}`);
    }

    updateTicket(id: string, payload: any) {
        return this.http.put(`${this.base}/${id}`, payload);
    }

    createTicket(payload: any) {
        return this.http.post(`${this.base}`, payload);
    }
}
