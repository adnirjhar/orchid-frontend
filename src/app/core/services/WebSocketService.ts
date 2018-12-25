import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/User';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {SocketMsg} from '../model/SocketMsg';

@Injectable()
export class WebSocketService {

    private serverUrl = '/orchid/socket';
    private stompClient : any = null;
    private msgReceiveCbs : any = {};

    ///********************************************************
    ///  SERVICE URLS
    ///********************************************************

    constructor(private http: HttpClient) {
        this.connect();
    }

    private connect() {
        this.stompClient = Stomp.over(new SockJS(this.serverUrl));
        this.stompClient.connect({}, (frame) => {
            this.stompClient.subscribe("/orchidWSChannel", this.onWsMsgReceived.bind(this));
        });
    }

    public sendWsMessage(message) {
        let msg : SocketMsg = new SocketMsg(message);
        this.stompClient.send("/send/genericMessageWS" , {}, JSON.stringify(msg));
    }

    private onWsMsgReceived(message) {
        if(message.body) {
            let msg = JSON.parse(message.body);
            for (let prop in this.msgReceiveCbs) {
                if (this.msgReceiveCbs.hasOwnProperty(prop) && this.msgReceiveCbs[prop]) {
                    this.msgReceiveCbs[prop](msg);
                }
            }
        }
    }

    public registerCallBack(param, cb) {
        this.msgReceiveCbs[param] = cb;
    }
}
