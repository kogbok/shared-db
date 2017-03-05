import {BucketId} from '../types'
import {IBucketLogEntry} from './bucket_log_entry'

export class BucketParameters {
  name: string;
}

/*-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
                                          +----------------+
                                          | ITransactionLE |
                                          +----------------+
                                                   ^
                                                   |
                 +--------------------------------------------------------------------+
                 |                                 |                                  |
  +----------------------------+    +-----------------------------+    +----------------------------+
  | TransactionLE_CreateBucket |    | TransactionLE_DestroyBucket |    | TransactionLE_UpdateBucket |
  +----------------------------+    +-----------------------------+    +----------------------------+
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --*/
export const enum ETransactionLE_Type {
  CREATE_BUCKET = 0,
  DESTROY_BUCKET = 1,
  UPDATE_BUCKET = 2
}

export interface ITransactionLE {
  type: ETransactionLE_Type;
}
//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export class TransactionLE_CreateBucket implements ITransactionLE {
  type = ETransactionLE_Type.CREATE_BUCKET;
  id: BucketId;
  parameters: BucketParameters;

  constructor(id: BucketId, p: BucketParameters) {
    this.id = id;
    this.parameters = p;
  }

  static create(id: BucketId, p: BucketParameters): TransactionLE_CreateBucket {
    return new TransactionLE_CreateBucket(id, p);
  }
}

export class TransactionLE_DestroyBucket implements ITransactionLE {
  type = ETransactionLE_Type.DESTROY_BUCKET;
  id: BucketId;

  constructor(id: BucketId){
    this.id = id;
  }

  static create(id: BucketId): TransactionLE_DestroyBucket {
    return new TransactionLE_DestroyBucket(id);
  }
}

export class TransactionLE_UpdateBucket implements ITransactionLE {
  type = ETransactionLE_Type.UPDATE_BUCKET;
  logs: Array<IBucketLogEntry>;
  bucket_id: BucketId

  constructor(bucket_id: BucketId, logs: Array<IBucketLogEntry>) {
    this.bucket_id = bucket_id;
    this.logs = logs;
  }

  static create(bucket_id: BucketId, logs: Array<IBucketLogEntry>): TransactionLE_UpdateBucket {
    return new TransactionLE_UpdateBucket(bucket_id, logs);
  }
}
//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --