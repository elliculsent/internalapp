/* eslint-disable prefer-const */
import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs/index';

// COMPONENTS
import {AlertComponent} from './alert/alert.component';
import {ConfirmComponent} from './confirm/confirm.component';
import {ErrorComponent} from './error/error.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {GuideAcquisitionComponent} from './guide-acquisition/guide-acquisition.component';
import {InfoComponent} from './info/info.component';
import {LanguageNCountryComponent} from './language-n-country/language-n-country.component';
import {LeadAcquisitionComponent} from './lead-acquisition/lead-acquisition.component';
import {LoginFunnelsComponent} from './login-funnels/login-funnels.component';
import {LoginComponent} from './login/login.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {SignupComponent} from './signup/signup.component';

@Injectable()
export class UexPopupService {
    constructor(private dialog: MatDialog) {}

    alert(title: string, htmlContent: string): Observable<any> {
        let dialogRef: MatDialogRef<AlertComponent>;
        dialogRef = this.dialog.open(AlertComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.htmlContent = htmlContent;

        return dialogRef.afterClosed();
    }

    info(title: string, htmlContent: string): Observable<any> {
        let dialogRef: MatDialogRef<InfoComponent>;
        dialogRef = this.dialog.open(InfoComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.htmlContent = htmlContent;

        return dialogRef.afterClosed();
    }

    confirm(htmlContent: string): Observable<any> {
        let dialogRef: MatDialogRef<ConfirmComponent>;
        dialogRef = this.dialog.open(ConfirmComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.htmlContent = htmlContent;

        return dialogRef.afterClosed();
    }

    error(title: string, htmlContent: string): Observable<any> {
        let dialogRef: MatDialogRef<ErrorComponent>;
        dialogRef = this.dialog.open(ErrorComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.htmlContent = htmlContent;

        return dialogRef.afterClosed();
    }

    login(config: any): Observable<any> {
        let dialogRef: MatDialogRef<LoginComponent>;
        dialogRef = this.dialog.open(LoginComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.config = config;

        return dialogRef.afterClosed();
    }

    loginFunnels(data: any): Observable<any> {
        let dialogRef: MatDialogRef<LoginFunnelsComponent>;
        dialogRef = this.dialog.open(LoginFunnelsComponent, {width: '700px'});
        dialogRef.componentInstance.data = data;

        return dialogRef.afterClosed();
    }

    forgotPassword(config: any, email: string): Observable<any> {
        let dialogRef: MatDialogRef<ForgotPasswordComponent>;
        dialogRef = this.dialog.open(ForgotPasswordComponent, {
            panelClass: 'uex-modal',
            data: email,
        });
        dialogRef.componentInstance.config = config;

        return dialogRef.afterClosed();
    }

    signUp(config: any): Observable<any> {
        let dialogRef: MatDialogRef<SignupComponent>;
        dialogRef = this.dialog.open(SignupComponent, {panelClass: 'uex-modal'});
        dialogRef.componentInstance.config = config;

        return dialogRef.afterClosed();
    }

    resetPassword(): Observable<any> {
        let dialogRef: MatDialogRef<ResetPasswordComponent>;
        dialogRef = this.dialog.open(ResetPasswordComponent, {panelClass: 'uex-modal'});

        return dialogRef.afterClosed();
    }

    leadAcquisition(config: any, selectedCountry: string, showArrow = false): Observable<any> {
        let dialogRef: MatDialogRef<LeadAcquisitionComponent>;
        if (showArrow) {
            dialogRef = this.dialog.open(LeadAcquisitionComponent, {
                panelClass: 'uex-lead-acquisition-popup',
                width: '700px',
            });
            dialogRef.componentInstance.config = config;
            dialogRef.componentInstance.selectedCountry = selectedCountry;
            dialogRef.componentInstance.showArrow = showArrow;
        } else {
            dialogRef = this.dialog.open(LeadAcquisitionComponent, {
                width: '700px',
            });
            dialogRef.componentInstance.config = config;
            dialogRef.componentInstance.selectedCountry = selectedCountry;
        }
        return dialogRef.afterClosed();
    }

    guideAcquisition(config: any): Observable<any> {
        let dialogRef: MatDialogRef<GuideAcquisitionComponent>;

        dialogRef = this.dialog.open(GuideAcquisitionComponent, {
            width: '700px',
        });
        dialogRef.componentInstance.config = config;

        return dialogRef.afterClosed();
    }

    languageNcountry(config: any, selectedLanguage: string, selectedCountry: string): Observable<any> {
        let dialogRef: MatDialogRef<LanguageNCountryComponent>;
        dialogRef = this.dialog.open(LanguageNCountryComponent, {
            width: '700px',
        });
        dialogRef.componentInstance.config = config;
        dialogRef.componentInstance.selectedLanguage = selectedLanguage;
        dialogRef.componentInstance.selectedCountry = selectedCountry;

        return dialogRef.afterClosed();
    }
}
