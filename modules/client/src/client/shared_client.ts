import {IStore, ISharedAgent, ReplicaId, BucketId, IReplicaState, Status, BundleLE, ILogicalstamp} from 'sdb_core'

export class SharedClientINode {
  shared_stamp;
  local_stamp: ILogicalstamp = null;
}

export class SharedClient {
  private inode_ = new SharedClientINode();
  private store_: IStore;
  private shared_agent_: ISharedAgent;

  constructor(store: IStore, shared_agent: ISharedAgent) {
    this.store_ = store;
    this.shared_agent_ = shared_agent;
  }

  get_state(bucket_id: BucketId, replica_id: ReplicaId): IReplicaState {
    return null;
  }

  get_local_stamp(): ILogicalstamp {
    return this.inode_.local_stamp;
  }

  // async push(local_stamp: ILogicalstamp, le: BundleLE): Promise<Status> {
  //   await shared_agent_.push({logicalstamp: [this.inode_.shared_stamp, });
  //   let new_inode = Object.assign({}, this.inode_);
  //   new_inode.local_stamp = 
  //   await this.store_.bulk_put([])

  //   this.inode = new_inode;

  // }
}