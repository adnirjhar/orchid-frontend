import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/User';
import {Observable} from 'rxjs';
const $q = require('q');

@Injectable()
export class OrchidServices {

    public currentUser: User = null;
    public allInstances: any[] = null;
    ///********************************************************
    ///  SERVICE URLS
    ///********************************************************
    public adminServiceUrl = '/api/admin';
    public accountServiceUrl = '/api/account';

    constructor(private http: HttpClient) {
        this.init();
    }

    public init() {
        this.getCurrentUser().subscribe((user) => {
            this.assignCurrentUser(user);
        });
    }

    public getAdminData() {

        return this.http.get('/api/admin/fetchAllInstances').toPromise().then((instances : any) => {

            return $q.all(instances.map((instance) => {

                return this.http.get('/api/admin/fetchESPDevicesByInstanceId/' + instance.id).toPromise().then((devices : any) => {

                    return $q.all(devices.map((device) => {

                        return this.http.get('/api/admin/fetchAllESPHardwaresByDeviceId/' + device.id).toPromise().then((hardwares : any) => {
                            device.relays = hardwares.relays;
                            device.sensors = hardwares.sensors;

                            return device;
                        });
                    }))
                    .then((allDevices) => {
                        instance.devices = allDevices;
                        return instance;
                    });
                });
            }))
            .then((allData) => {
                this.allInstances = allData;
                return this.allInstances;
            });
        });
    }

    public fetchWidgetSummary() {
        return this.http.get('/api/dashboard/widgetSummary').toPromise();
    }

    public fetchLogSummary() {
        return this.http.get('/api/dashboard/logSummary').toPromise();
    }

    ///********************************************************
    ///  Services for Instance setup
    ///********************************************************

    public updateInstance(payload) {
        return this.http.post('/api/admin/updateInstance',payload);
    }

    public deleteInstance(payload) {
        return this.http.post('/api/admin/deleteInstance',{id : payload.id},{
            responseType: 'text'
        });
    }

    ///********************************************************
    ///  Services for Device setup
    ///********************************************************

    public addNewDevice(newDevice) {
        return this.http.post('/api/admin/storeESPDevice',newDevice);
    }

    public deleteDevice(newDevice) {
        return this.http.post('/api/admin/deleteESPDevice',newDevice, {
            responseType: 'text'
        });
    }

    ///********************************************************
    ///  Services for Hardware setup
    ///********************************************************

    public addNewESPHardware(newESP) {
        return this.http.post('/api/admin/addESPHardware',newESP);
    }

    public deleteESPHardware(esp) {
        return this.http.post('/api/admin/deleteESPHardware',esp,{
            responseType: 'text'
        });
    }

    public updateDeviceValue(espHardware) {
        espHardware.lastValue = espHardware.lastValue ? 1 : 0;
        espHardware.lastLogged = new Date();
        return this.http.post(this.adminServiceUrl + '/updateESPHardware', espHardware);
    }
    ///********************************************************
    ///  Services for user setup
    ///********************************************************
    public getCurrentUser() {
        return this.http.get<any>(this.accountServiceUrl + '/getCurrentUser').map((response) => {
            return this.assignCurrentUser(response);
        });
    }

    public authenticate(email, pass) {
        return this.http.post(this.accountServiceUrl + '/login', {
            'email': email,
            'password': pass
        }).map((response) => {
            return this.assignCurrentUser(response);
        });
    }

    public assignCurrentUser(userObject) {
        this.currentUser = userObject ? Object.assign(new User(), userObject) : null;
        return this.currentUser;
    }

    public logOut() {
        return this.http.get(this.accountServiceUrl + '/logout').map((response) => {
            this.assignCurrentUser(null);
            return response;
        });
    }
}
