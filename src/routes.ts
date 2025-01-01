//when we deploy on kuberneets we need to monitor the notification service
// no controllers because no http req based , only one route which will be health , we will not send any http req or connect to db in this .

//these routes will be accessed from outside no need to add jwt and all and not req to come from api gateway


import express,{Router,Request,Response} from 'express';
import  {StatusCodes} from 'http-status-codes';
const router:Router = express.Router();
export function healthRoutes():Router{
    router.get('/notification-health' , (_req:Request,res:Response)=>{
        res.status(StatusCodes.OK).send('Notification service is healthy');
    });
    return router;
}