import {IReplicaState, IReplicaLogger, ECommonReplicaType} from '../types'
import * as document_impl from './replica_data_type/document'
import * as pncounter_impl from './replica_data_type/pn_counter'
// export namespace rdt.json {
// export import Document = sdb.rdt.Document;
// }

// export import replica = sdb.rdt.json;
export module replica {
  export import Document = document_impl;
  export import PNCounter = pncounter_impl;
};

export let common_replica_applies         = Array<(ReplicaState, ReplicaLog) => void> (ECommonReplicaType.NB_ELEMENT);
export let common_replica_state_creators  = Array<() => IReplicaState> (ECommonReplicaType.NB_ELEMENT);
export let common_replica_logger_creators = Array<() => IReplicaLogger> (ECommonReplicaType.NB_ELEMENT);

/*-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
  for all common replica:
     -get_common_replica_type_name: add replica case
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --*/
export function get_common_replica_type_name(type: ECommonReplicaType): string {
  switch(type) {
    case ECommonReplicaType.PN_COUNTER:
      return 'PNCounter';
     default:
       throw "error in get_common_replica_type_name";
  }
}

function register_common_replica(type: ECommonReplicaType, type_name: string) {
  common_replica_applies        [type] = replica[type_name].apply;
  common_replica_state_creators [type] = () => {return new replica[type_name].State();};
  common_replica_logger_creators[type] = () => {return new replica[type_name].Logger();};
} 

//auto Fill common_replica array
for (let i=0; i<ECommonReplicaType.NB_ELEMENT; i++) {
  register_common_replica(i, get_common_replica_type_name(i));
}

// common_replica_applies        [ECommonReplicaType.PN_COUNTER] = replica.PNCounter.apply;
// common_replica_state_creators [ECommonReplicaType.PN_COUNTER] = () => {return new replica.PNCounter.State();};
// common_replica_logger_creators[ECommonReplicaType.PN_COUNTER] = () => {return new replica.PNCounter.Logger();};