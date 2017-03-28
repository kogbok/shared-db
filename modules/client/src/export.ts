import {IStore, ISharedAgent} from 'sdb_core' 
import {Database} from './database'
import {IDatabase, IBucketUpdater} from './types'
import {BucketUpdater} from './transaction/updater/bucket_updater'
import {LocalClient as LocalClient_impl} from './client/local_client' 
import {SharedClient} from './client/shared_client'

import * as detail_impl from './detail'

export function create_database(store: IStore, shared_agent: ISharedAgent): IDatabase {
  let local_client = new LocalClient_impl(store);
  let shared_client = new SharedClient(store, shared_agent);
  return new Database(local_client, shared_client);
}

export function create_bucket_updater(bucket_id: string): IBucketUpdater {
  return new BucketUpdater(bucket_id);
}

export import detail = detail_impl;
