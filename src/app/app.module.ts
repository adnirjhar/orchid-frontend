import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ToastrModule} from 'ngx-toastr';
import {NguiMapModule} from '@ngui/map';
import {AccordionModule,ModalModule} from 'ngx-bootstrap';
import {UiSwitchModule} from 'ngx-ui-switch';

import {AppComponent} from './app.component';
import {AppRoutes} from './app.routing';
import {SidebarModule} from './sidebar/sidebar.module';
import {NavbarModule} from './shared/navbar/navbar.module';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {HeaderInterceptor} from './core/interceptors/header.interceptor';
import {ResponseInterceptor} from './core/interceptors/response.interceptor';
import {OrchidServices} from './core/services/OrchidServices';

import {WebSocketService} from './core/services/WebSocketService';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        AdminComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,

        BrowserAnimationsModule,
        BrowserModule,
        RouterModule.forRoot(AppRoutes),
        ToastrModule.forRoot(),
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        SidebarModule,
        NavbarModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
        UiSwitchModule
    ],
    providers: [
        OrchidServices,
        WebSocketService,
        {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
