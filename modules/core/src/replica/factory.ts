import {ReplicaType, EReplicaCategoryType, ReplicaId, BucketId, IReplicaState, ECommonReplicaType, DocumentSchema, DocumentSchemaType, log, IArrayReplicaOLog} from '../types'
import {replica, common_replica_state_creators, common_replica_applies} from './register'
import {IDocumentSchemaResolver} from '../medium/query_resolver'
import {string_to_replica_category_type, string_to_common_replica_type} from '../tools/helper'

export function create_replica_state_id(category: EReplicaCategoryType, type: ReplicaType, id: ReplicaId, bId: BucketId = null, resolver: IDocumentSchemaResolver = null): IReplicaState {
  let state = create_replica_state(category, type, bId, resolver);
  state.id = id;
  return state;
}

export function create_replica_state(category: EReplicaCategoryType, type: ReplicaType, bId: BucketId = null, resolver: IDocumentSchemaResolver = null): IReplicaState {
  let state: IReplicaState;

  switch (category) {
    case EReplicaCategoryType.COMMON:
      state = common_replica_state_creators[type as ECommonReplicaType]();
      break;
    case EReplicaCategoryType.DOCUMENT:
      let schema = resolver.get_document_schema(type as DocumentSchemaType, bId);
      state = create_document_state(schema, bId, resolver);
      break;
    case EReplicaCategoryType.CLIENT:
      log.error("cc2 PROPER");  // TODO
      break;
    default:
      log.error("cc2"); // TODO
      break;
  }
  
  return state;
}

export function create_document_state(schema: DocumentSchema, bId: BucketId, resolver: IDocumentSchemaResolver) {
  let state = new replica.Document.State();

  for(let k in schema.properties) {
    let category = string_to_replica_category_type(schema.properties[k].category);
    let type: ReplicaType = null;

    switch (category) {
      case EReplicaCategoryType.COMMON:
        type = string_to_common_replica_type(schema.properties[k].type);
        break;
      case EReplicaCategoryType.DOCUMENT:
      case EReplicaCategoryType.CLIENT:
        type = schema.properties[k].type;
        break;
      default:
        log.error("cc3"); // TODO
        break;
    }
    state[k] = create_replica_state(category, type, bId, resolver);
  }
    

  return state;
}

export function apply_on_replica(state: IReplicaState, rls: IArrayReplicaOLog) {
  switch (state.category) {
    case EReplicaCategoryType.COMMON:
      common_replica_applies[state.type](state, rls);
      break;
    case EReplicaCategoryType.DOCUMENT:
      Document.apply(state, rls as Array<replica.Document.OLog>);
      break;
    case EReplicaCategoryType.CLIENT:
      log.error("cc PROPER");  // TODO
      break;
    default:
      log.error("cc"); // TODO
      break;
  }
}