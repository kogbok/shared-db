import {IStore, BucketId, ReplicaId, Status, BundleLE, IReplicaState, Output} from 'sdb_core'
import {IDatabase, ITransaction} from './types'
import {Transaction} from './transaction/transaction'
import {LocalClient} from './client/local_client'
import {SharedClient} from './client/shared_client'

const default_local_agent = 0;
export class Database implements IDatabase{
  private local_: LocalClient;
  private shared_: SharedClient;

  constructor(local: LocalClient, shared: SharedClient) {
    this.local_ = local;
    this.shared_ = shared;
  }

  begin_transaction(): ITransaction {
    return new Transaction(this);
  }

  async commit(t: ITransaction): Promise<Status> {
    let bundle = BundleLE.create_from_transactions_le((t as Transaction).build());
    return this.local_.append(default_local_agent, bundle);
    // return this.store_.push_bundle(default_local_agent, bundle);


    // return new Promise<Status>((resolve, reject) => {
    //   let bundle = create_bundle_le((t as Transaction).build());
    //   resolve(Status.create_ok());
    // });
  }

  get(bucket_id: BucketId, replica_id: ReplicaId): any {
    let o_state = new Output<IReplicaState>();
    o_state.data = this.shared_.get_state(bucket_id, replica_id);
    //let from_version = this.shared_.get_local_version();
    //let to_version = null;
    this.local_.update_or_create(bucket_id, replica_id, o_state/*, from_version, to_version*/);

    if (o_state.data == null) return null
    return o_state.data.value();
  }
} 
