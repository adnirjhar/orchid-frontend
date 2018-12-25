import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrchidServices} from '../core/services/OrchidServices';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {WebSocketService} from '../core/services/WebSocketService';
import {log} from 'util';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    ///********************************************************
    ///  PROPS
    ///********************************************************
    public allWidgetData : any = {};
    public allLogSummaryData : any = {};
    public objectKeys = Object.keys;

    constructor(
        private orchidServices : OrchidServices,
        private toastr : ToastrService,
        private modalService: BsModalService,
        private wsService : WebSocketService
    ) {}

    ngOnInit() {
        this.fetchWidgetSummary();
        this.fetchLogSummary();
        this.wsService.registerCallBack('dashboard-component',this.onWsMsgReceived.bind(this))
    }

    fetchWidgetSummary() {
        this.orchidServices.fetchWidgetSummary().then((widgetData) => {
            this.allWidgetData = widgetData;
        });
    }

    fetchLogSummary() {
        this.orchidServices.fetchLogSummary().then((dashboardData) => {
            this.allLogSummaryData = dashboardData;
            console.log(this.allLogSummaryData);
        });
    }

    isESPHardwareGroupEnabled(instanceName,espName,espHardware) {
        return this.allLogSummaryData &&
               this.allLogSummaryData.hasOwnProperty(instanceName) &&
               this.allLogSummaryData[instanceName].hasOwnProperty(espName) &&
               this.allLogSummaryData[instanceName][espName].hasOwnProperty(espHardware) &&
               this.allLogSummaryData[instanceName][espName][espHardware].length > 0;

    }

    addNewDeviceLogToUI(payloadObj) {
        if (!payloadObj.instance || !payloadObj.espDevice || !payloadObj.espHardware || !payloadObj.espDeviceLog) {
            return;
        }
        let logParent =
            this.allLogSummaryData[payloadObj.instance] &&
            this.allLogSummaryData[payloadObj.instance][payloadObj.espDevice] &&
            this.allLogSummaryData[payloadObj.instance][payloadObj.espDevice][payloadObj.espHardware];

        if (!logParent) {logParent = [];}
        logParent.push(payloadObj.espDeviceLog);
        this.toastr.info(`${payloadObj.instance} - ${payloadObj.espDevice} - ${payloadObj.espHardware} - ${payloadObj.espDeviceLog.data}`)

    }

    ///********************************************************
    ///  WEBSOCKET METHODS
    ///********************************************************

    onWsMsgReceived(payload) {
        let payloadObj = payload.message ? JSON.parse(payload.message) : null;
        this.addNewDeviceLogToUI(payloadObj);
    }

    sendMessage() {
        this.wsService.sendWsMessage('asdfasdfasdf');
    }
}
