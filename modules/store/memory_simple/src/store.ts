import {BucketId, ReplicaId, IStore, Status, AgentId, BundleLE, BundleBucketLE, IArrayReplicaOLog, BucketParameters, EReplicaCategoryType, ReplicaType, create_replica_state_id, apply_on_replica} from 'sdb_core'

export class LocalAgentLE {
  private current_bles_: BundleLE = new BundleLE ();
  private committed_bles_: Array<BundleLE> = [];

  append(le: BundleLE) {
    this.current_bles_.append(le);
  }

  get_bucket_parameters_if_created(id: BucketId): BucketParameters {
    for (let i=0, l=this.committed_bles_.length; i<l; i++) {
      let info = this.committed_bles_[i].get_bucket_parameters_if_created(id);
      if (info !== null) return info.parameters;
    }

    let info = this.current_bles_.get_bucket_parameters_if_created(id);
    if (info !== null) return info.parameters;

    return null;
  }

  is_bucket_deleted(id: BucketId): boolean {
    for (let i=0, l=this.committed_bles_.length; i<l; i++)
      if(this.committed_bles_[i].is_bucket_deleted(id))
        return true;

    return this.current_bles_.is_bucket_deleted(id);
  }

  get_bucket_polog_if(id: BucketId): BundleBucketLE {
    let bble = null;

    for (let i=0, l=this.committed_bles_.length; i<l; i++) {
      let c = this.committed_bles_[i].get_bucket_polog_if(id);
      if (c !== null) 
        if (bble === null) bble = c;
        else bble.append(c);
    }

    let c = this.current_bles_.get_bucket_polog_if(id);
    if (c !== null) 
      if (bble === null) bble = c;
      else bble.append(c);

    return bble;
  }

  commit() {
    this.committed_bles_.push(this.current_bles_);
    this.current_bles_ = new BundleLE();
  }
}

const default_local_agent = 0;

export class Store implements IStore {
  private local_agents_: {[key:number/*AgentId*/]: LocalAgentLE} = {};

  constructor() {
    this.create_agent(default_local_agent);
  }

  async push_bundle(agent_id: AgentId, bundle_le: BundleLE): Promise<Status> {
    return new Promise<Status>((resolve, reject) => {
      if (!this.local_agents_.hasOwnProperty(agent_id))
        throw new Error ("Store::push_bundle agent id unknown");

      this.local_agents_[agent_id].append(bundle_le);
      resolve(Status.create_ok());
    });
  }

  create_agent(agent_id: AgentId) {
    if (this.local_agents_.hasOwnProperty(agent_id))
      throw new Error("Store::create_agent local agent already created");

    this.local_agents_[agent_id] = new LocalAgentLE();
  }

  get_value(bucket_id: BucketId, replica_id: ReplicaId): any {
    let bucket_params: BucketParameters = null;
    let replica_pologs: IArrayReplicaOLog = [];
    let replica_info: {category: EReplicaCategoryType, type: ReplicaType} = null;

    for (let id in this.local_agents_) {
      if (this.local_agents_[id].is_bucket_deleted(bucket_id))
        return null;

      if (bucket_params === null)
        bucket_params = this.local_agents_[id].get_bucket_parameters_if_created(bucket_id);

      let b_polog = this.local_agents_[id].get_bucket_polog_if(bucket_id);
      if (b_polog != null) {
        if (b_polog.is_replica_deleted(replica_id))
          return null;
        
        if (replica_info === null)
          replica_info = b_polog.get_replica_type_if_created(replica_id);

        let r_polog = b_polog.get_replica_polog_if(replica_id);
        if (r_polog != null)
          Array.prototype.push.apply(replica_pologs, r_polog);
      }  
    }

    if (replica_info === null) return null;

    let state = create_replica_state_id(replica_info.category, replica_info.type, replica_id, bucket_id);
    apply_on_replica(state, replica_pologs);

    return state.value();
  }

  private is_agent_committable(agent_id: AgentId): boolean {
    return true;
  }

  async commit_agent(agent_id: AgentId): Promise<Status> {
    return new Promise<Status>((resolve, reject) => {
      if (!this.local_agents_.hasOwnProperty(agent_id))
        throw new Error ("Store::commit_agent agent id unknown");

      if (!this.is_agent_committable(agent_id))
        throw new Error ("Store::commit_agent agent id not committable");

      this.local_agents_[agent_id].commit();
      resolve(Status.create_ok());
    });
  }
}