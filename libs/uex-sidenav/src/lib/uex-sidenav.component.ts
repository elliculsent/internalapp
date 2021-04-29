import {AfterViewInit, Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {UexSidenavService} from './uex-sidenav.service';

@Component({
    selector: 'uex-sidenav',
    templateUrl: './uex-sidenav.component.html',
    styleUrls: ['./uex-sidenav.component.scss'],
})
export class UexSidenavComponent implements AfterViewInit {
    private container: HTMLElement;
    public title: string;
    public htmlContent: string;
    @Output() eOpenLeadAcquisition: EventEmitter<boolean> = new EventEmitter();

    constructor(private elRef: ElementRef, private sidenavService: UexSidenavService) {}

    ngAfterViewInit(): void {
        let eventAdded = false;
        this.sidenavService.emitSidenavData.subscribe((data: any) => {
            this.title = data.title;
            this.htmlContent = data.htmlContent;

            if (this.container) {
                setTimeout(() => {
                    const tempCont = this.elRef.nativeElement.querySelector('.lead-acquisition');
                    if (this.container) {
                        if (this.container !== tempCont) {
                            tempCont.addEventListener('click', () => {
                                this.emitLeadAcquisition();
                            });
                            eventAdded = true;
                            this.container = tempCont;
                        } else if (this.container === tempCont && !eventAdded) {
                            tempCont.addEventListener('click', () => {
                                this.emitLeadAcquisition();
                            });
                            eventAdded = true;
                        }
                    }
                });
            } else {
                setTimeout(() => {
                    this.container = this.elRef.nativeElement.querySelector('.lead-acquisition');
                    if (this.container) {
                        this.container.addEventListener('click', () => {
                            this.emitLeadAcquisition();
                        });
                        eventAdded = true;
                    }
                });
            }
        });
    }

    close(): void {
        this.sidenavService.close();
    }

    emitLeadAcquisition(): void {
        this.sidenavService.close();
        this.eOpenLeadAcquisition.emit(true);
    }
}
