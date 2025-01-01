import {Client} from '@elastic/elasticsearch';
import {config} from '@notifications/config';
import { winstonLogger } from '@siddhant0601/ecom-shared';
import {Logger} from 'winston';
import { ClusterHealthResponse  } from '@elastic/elasticsearch/lib/api/types';
const log : Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'notificationElasticSearch','debug');

const elasticSearchClient : Client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkConnection():Promise<void> {
    var isConnected:boolean=false;
    while(!isConnected){
        try {
            const health:ClusterHealthResponse =await elasticSearchClient.cluster.health({});
            log.info(`NotificationService Elasticsearch health status - ${health.status}`);
            isConnected=true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'NotificationService checkConnection() method:', error);
        }
    }
}