import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {OrchidServices} from '../core/services/OrchidServices';
import {WebSocketService} from '../core/services/WebSocketService';
import {ToastrService} from 'ngx-toastr';
import {ModalDirective} from 'ngx-bootstrap';


@Component({
    moduleId: module.id,
    selector: 'admin-cmp',
    templateUrl: 'admin.component.html'
})

export class AdminComponent {

    ///********************************************************
    ///  VIEW PROPS
    ///********************************************************
    @ViewChild('instanceForm') instanceNgForm : NgForm;
    @ViewChild('deviceForm') deviceNgForm : NgForm;
    @ViewChild('hardwareForm') hardwareNgForm : NgForm;
    @ViewChild('instanceModal') instanceNgModalDir : ModalDirective;
    @ViewChild('deviceModal') deviceModalDir : ModalDirective;
    @ViewChild('hardwareModal') hardwareModalDir : ModalDirective;

    ///********************************************************
    ///  PROPS
    ///********************************************************
    public createNewInstanceData : any = {};
    public createNewDeviceData : any = {};
    public createNewHardwareData : any = {};
    public tempContainer : any;
    public allInstanceData : any = [];
    public hardwareIdPin = 1;

    constructor(
        private orchidServices : OrchidServices,
        private wsService : WebSocketService,
        private router : Router,
        private toastr : ToastrService
    ) {
        this.checkAuthentication();
    }

    fetchDashboardData() {
        this.orchidServices.getAdminData().then((allInstanceData) => {
            this.allInstanceData = this.orchidServices.allInstances;
        });
    }

    checkAuthentication() {
        this.orchidServices.getCurrentUser().subscribe((response) => {
            if (!response) {
                this.router.navigate(['/login']);
            }
            else {
                this.init();
            }
        })
    }

    init() {
        this.fetchDashboardData();
        this.wsService.registerCallBack('dashboard-component',this.onWsMsgReceived)
    }

    turnOffRelayOffice(espHardware) {

        this.orchidServices.updateDeviceValue(espHardware).subscribe(
            (updatedDevice) => {
                // console.log(updatedDevice);
            },
            (error) => {
                if (error.status === 403) {
                    this.toastr.error("Request not authorised!");
                }
            }
        );
    }

    ///********************************************************
    ///  METHODS FOR UI
    ///********************************************************
    onHardwareIdParamsChange() {
        this.createNewHardwareData.hardwareId = this.createNewHardwareData.type.toString().toUpperCase() + this.hardwareIdPin;
    }

    ///********************************************************
    ///  CREATE AND DELETE INSTANCE METHODS
    ///********************************************************
    showModalForNewInstance() {
        this.createNewInstanceData = {};
        this.instanceNgModalDir.show();
    }

    updateInstance() {
        let isOldInstance = this.createNewInstanceData.id >= 0;
        this.orchidServices.updateInstance(this.createNewInstanceData).subscribe(
            (instance : any) => {
                instance.devices = [];
                if (!isOldInstance) {
                    this.allInstanceData.push(instance);
                    this.toastr.success(instance.title + ' instance created.');
                }
                else {
                    this.toastr.success('Instance updated.');
                }
            },
            (error) => {
                this.toastr.error(error.error);
            },
            () => {
                this.instanceNgModalDir.hide();
            }
        );
    }

    editInstance(instance,insIndex) {
        this.createNewInstanceData = instance;
        this.instanceNgModalDir.show();
    }

    deleteInstance(instance,insIndex) {
        this.orchidServices.deleteInstance(instance).subscribe(
            (instance : any) => {
                this.toastr.success('Instance deleted.');
                this.allInstanceData.splice(insIndex,1);
            },
            (error) => {
                this.toastr.error(error.error);

            }
        );
    }

    ///********************************************************
    ///  CREATE AND DELETE DEVICE METHODS
    ///********************************************************

    addNewDevice() {
        this.orchidServices.addNewDevice(this.createNewDeviceData).subscribe(
            (newDevice : any) => {
                this.toastr.success(newDevice.title + ' device created');
                newDevice.relays = [];
                newDevice.sensors = [];
                this.tempContainer.devices.push(newDevice);
                this.deviceModalDir.hide();
            },
            (error) => {
                this.toastr.error(error.error);
                this.deviceModalDir.hide();
            }
        );
    }

    deleteDevice(instanceDevices,device,deviceIndex) {
        this.orchidServices.deleteDevice(device).subscribe(
            (message) => {
                this.toastr.success('Device deleted.');
                instanceDevices.splice(deviceIndex,1);
            },
            (error) => {
                this.toastr.error(error.error);
            }
        );
    }

    showAddNewDeviceModal(instance) {
        this.createNewDeviceData = {};
        this.createNewDeviceData.enabled = true;
        this.createNewDeviceData.instance = instance;
        this.deviceModalDir.show();
        this.tempContainer = instance;
    }

    ///********************************************************
    ///  CREATE AND DELETE RELAY METHODS
    ///********************************************************

    addNewESPHardware() {
        this.orchidServices.addNewESPHardware(this.createNewHardwareData).subscribe(
            (newESP : any) => {
                this.toastr.success(newESP.title + ' - New ESPHardware created');

                if (newESP.type === 'Relay' && this.tempContainer.relays) {
                    this.tempContainer.relays.push(newESP);
                }
                else if (newESP.type === 'Sensor' && this.tempContainer.sensors) {
                    this.tempContainer.sensors.push(newESP);
                }
                this.hardwareModalDir.hide();
            },
            (error) => {
                this.toastr.error(error.error);
                this.hardwareModalDir.hide();
            }
        );
    }

    deleteESPHardware(espHardwares,esp,espIndex) {
        this.orchidServices.deleteESPHardware(esp).subscribe(
            (newESP : any) => {
                this.toastr.success('ESPHardware deleted');
                espHardwares.splice(espIndex,1);
            },
            (error) => {
                this.toastr.error(error.error);
            }
        );
    }

    showAddNewHardwareModal(device) {
        this.createNewHardwareData = {};
        this.createNewHardwareData.type = 'Relay';
        this.hardwareIdPin = 1;
        this.createNewHardwareData.enabled = true;
        this.createNewHardwareData.espDevice = device;
        this.onHardwareIdParamsChange();
        this.hardwareModalDir.show();
        this.tempContainer = device;
    }
    ///********************************************************
    ///  WEBSOCKET METHODS
    ///********************************************************

    onWsMsgReceived(message) {
        console.log('Message received at Admin component: ', message);
    }

    sendMessage() {
        this.wsService.sendWsMessage('asdfasdfasdf');
    }

    ///********************************************************
    ///  COMMON METHODS
    ///********************************************************
    isUserLoggedIn() {
        return !!this.orchidServices.currentUser;
    }
}
