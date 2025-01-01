// import { winstonLogger } from '@siddhant0601/ecom-shared';
// import {Logger } from 'winston';
import express, {Express} from 'express'
// const log : Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'notificationApp','debug');
import {start} from './server';
function initialize():void{
    const app:Express =express();
    start(app);
}
initialize();
