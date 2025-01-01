
import {  winstonLogger } from '@siddhant0601/ecom-shared';
import {Logger } from 'winston';
import 'express-async-errors';
import { Channel } from 'amqplib';
import {config} from '@notifications/config';
import { Application } from 'express';
import http from 'http';
import {healthRoutes} from '@notifications/routes';
import {checkConnection} from '@notifications/elasticserach';
import {createConnection} from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';
const SERVER_PORT = 4001 // for noti service
const log : Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'notificationServer','debug');
export function start(app:Application): void {
    //start the basic notification server where it will listen to 
    startServer(app);
    app.use('',healthRoutes());
    startQueues();
    //start the elasticserach function to send the logs 
    startElasticSearch();
}

async function startQueues(): Promise<void> {
    const notiChannel:Channel=await createConnection() as Channel;
    consumeAuthEmailMessages(notiChannel);
    consumeOrderEmailMessages(notiChannel);
    // const verificationLink= `${config.CLIENT_URL}/confirm_email?v_token=123234wwwwwwwwwwwww`;
    // const messageDetails:IEmailMessageDetails= {
    //     receiverEmail: `${config.SENDER_EMAIL}`,
    //     template: 'verifyEmail',
    //     verifyLink:verificationLink
    // }
    // const message= JSON.stringify(messageDetails);
    // await notiChannel.assertExchange('ecom-email-notification','direct');
    // notiChannel.publish('ecom-email-notification','auth-email',Buffer.from(message));
}
function startElasticSearch():void{
    checkConnection();
}
function startServer(app:Application): void{
    
    try{
        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification server running on port ${SERVER_PORT}`);
          });
    }
    catch(error){
        log.log('error', 'NotificationService startServer() method:', error);
    }
}