import {BucketId, ReplicaType, ReplicaId, DocumentSchema, DocumentSchemaType, TransactionLE_UpdateBucket, IArrayReplicaOLog, IReplicaLogger, Status} from 'sdb_core'

export type TransactionId  = number;
export type IReplicaUpdater = IReplicaLogger;

export interface IBucketUpdater {
  create_replica(type: ReplicaType): ReplicaId;
  delete_replica(id: ReplicaId): IBucketUpdater;
  update_replica(id: ReplicaId, l: IReplicaUpdater): IBucketUpdater;
  insert_document_schema(schema: DocumentSchema): IBucketUpdater;
  remove_document_schema(id: DocumentSchemaType): IBucketUpdater;
  build(): TransactionLE_UpdateBucket;
}

export class BucketParameters {
  name: string;
}

export interface ITransaction {
  id: TransactionId;
  create_bucket(p: BucketParameters): BucketId;
  destroy_bucket(id: BucketId): ITransaction;
  update_bucket(u: IBucketUpdater): ITransaction;
  commit();
  rollback();
}

export interface ISharedBase {
}

export interface IDatabase {
 begin_transaction(): ITransaction;
 commit(t: ITransaction): Promise<Status>;

 get(bucket_id: BucketId, replica_id: ReplicaId): any;
}
