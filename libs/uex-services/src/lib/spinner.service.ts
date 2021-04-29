import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SpinnerService {
    public emitSpinner: EventEmitter<any> = new EventEmitter();
}
