import {IReplicaState, DocumentSchema} from '../types'
import {BundleLE} from '../polog/bundle_log_entry'
import {IStore} from './store'

export class SharedDataBlock {
  logicalstamp;
  data: BundleLE;
}

export interface ISharedAgent {
  
}

export type AgentBlockId = number;
export type AgentId = number;

export interface IAgentListener {
  append_to_block(agent_id: AgentId, block_id: AgentBlockId, bundle: BundleLE);
}

export interface IAgent {
  append_to_current_block(bundle: BundleLE);

  add_listener(l: IAgentListener);
  remove_listener(l: IAgentListener);
}

export class Agent implements IAgent {  
  private listener_: Array<IAgentListener> = [];
  id: AgentId;
  first_block_id: AgentBlockId;
  current_block_id: AgentBlockId;

  append_to_current_block(bundle: BundleLE) {
    this.listener_.forEach((l) => {l.append_to_block(this.id, this.current_block_id, bundle);});
  }

  add_listener(l: IAgentListener) {
    if (this.listener_.indexOf(l) === -1) {
      //if(__DEV__) log.warn("listener already present"); // TODO
      return;
    }
    this.listener_.push(l);
  }

  remove_listener(l: IAgentListener) {
    let index = this.listener_.indexOf(l);
    if (index === -1) {
      //if(__DEV__) log.warn("listener not present"); // TODO
      return;
    }
    this.listener_.splice(index, 1);
  }
}

export class ClientAgent {
  agent_id: AgentId;
  start_block_id: AgentBlockId;
  end_block_id: AgentBlockId;
}

export type SnapshotId = string;

export class BucketSnapshot {
  replicas:{[key:string/*ReplicaId*/]:IReplicaState};
  documents_shemas:{[key:string /*DocumentSchemaType*/]: DocumentSchema};
}

export class Snapshot {
  id: SnapshotId;
  buckets:{[key:string/*BucketId*/]: BucketSnapshot};
}

export type DatabaseId = string;

export const enum ESharedDatabaseActionType {
  SNAPSHOT_CHANGED,
  ADD_CLIENT_AGENT,
  REMOVE_CLIENT_AGENT,
  CLIENT_AGENT_UPDATED_NEW_START,
  CLIENT_AGENT_UPDATED_NEW_END
}

export class SharedDatabaseAction {
  type: ESharedDatabaseActionType;
  data: any;
}

export interface ISharedDatabaseListener {
  shared_database_updated(id: SnapshotId, actions: Array<SharedDatabaseAction>);
}

export class SharedDatabase {
  id: DatabaseId;
  snapshot_id: SnapshotId;
  agents: Array<ClientAgent>;
  private listener_: Array<ISharedDatabaseListener>;
  private store_: IStore;

  constructor(store: IStore) {
    this.store_ = store;
  }

  update(actions: Array<SharedDatabaseAction>) {
    for(let i=0, l=actions.length; l>i; i++) {
      switch(actions[i].type){
        case ESharedDatabaseActionType.SNAPSHOT_CHANGED:
          this.id = actions[i].data;
        break;
        case ESharedDatabaseActionType.ADD_CLIENT_AGENT:
          this.agents.push();
        break;
        case ESharedDatabaseActionType.REMOVE_CLIENT_AGENT:
        break;
        case ESharedDatabaseActionType.CLIENT_AGENT_UPDATED_NEW_START:
        break;
        case ESharedDatabaseActionType.CLIENT_AGENT_UPDATED_NEW_END:
        break;
        default:
        //  log.error("SharedDatabase update default"); //TODO
      }
    }

    this.listener_.forEach((l) => {
      l.shared_database_updated(this.id, actions);
    });
  }

  add_listener(l: ISharedDatabaseListener) {
    if (this.listener_.indexOf(l) === -1) {
     // if(__DEV__) log.warn("listener already present"); // TODO
      return;
    }
    this.listener_.push(l);
  }

  remove_listener(l: ISharedDatabaseListener) {
    let index = this.listener_.indexOf(l);
    if (index === -1) {
      //if(__DEV__) log.warn("listener not present"); // TODO
      return;
    }
    this.listener_.splice(index, 1);
  }
}
