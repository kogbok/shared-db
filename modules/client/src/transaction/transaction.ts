import {ITransactionLE, BucketId, create_bucket_id, TransactionLE_CreateBucket, TransactionLE_DestroyBucket, TransactionLE_UpdateBucket} from 'sdb_core'
import {ITransaction, TransactionId, IDatabase, IBucketUpdater, BucketParameters} from '../types'

export class Transaction implements ITransaction {
  private id_: TransactionId;
  private db_: IDatabase;
  logs: Array<ITransactionLE>;

  constructor(db: IDatabase){
    this.logs = new Array<ITransactionLE>();
    this.db_ = db;
  }

  get id(): TransactionId {
    return this.id_;
  }

  set id(id: TransactionId) {
    this.id_ = id;
  }

  create_bucket(p: BucketParameters): BucketId {
    let id = create_bucket_id();
    this.logs.push(TransactionLE_CreateBucket.create(id, p));
    return id;
  }

  destroy_bucket(id: BucketId): Transaction {
    this.logs.push(TransactionLE_DestroyBucket.create(id));
    return this;
  }

  update_bucket(u: IBucketUpdater): Transaction {
    this.logs.push(u.build());
    return this;
  }

  async commit() {
    return this.db_.commit(this);
  }

  rollback() {
  }

  build(): Array<ITransactionLE> {
    return this.logs;
  }
}