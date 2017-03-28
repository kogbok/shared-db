import {EReplicaCategoryType, ReplicaType, ReplicaId, ECommonReplicaType, ClientReplicaType, DocumentSchemaType, IArrayReplicaOLog, DocumentSchema} from '../types'
/*-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
                                                             +----------------+
                                                             | BucketLogEntry |
                                                             +--------+-------+
                                                                      |
            +----------------------------+----------------------------------------------------------+---------------------------------+
            |                            |                            |                             |                                 |
  +---------+--------------+ +-----------+-------------+ +------------+-----------+ +---------------+---------------+ +---------------+---------------+
  | BucketLE_CreateReplica | | BucketLE_DestroyReplica | | BucketLE_UpdateReplica | | BucketLE_InsertDocumentSchema | | BucketLE_RemoveDocumentSchema |
  +------------------------+ +-------------------------+ +------------------------+ +-------------------------------+ +-------------------------------+
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --*/
export const enum EBucketLE_Type { 
  CREATE_REPLICA,
  DESTROY_REPLICA,
  UPDATE_REPLICA,
  INSERT_DOCUMENT_SCHEMA,
  REMOVE_DOCUMENT_SCHEMA
}

export interface IBucketLogEntry {
  type: EBucketLE_Type;
}
//-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export class BucketLE_CreateReplica implements IBucketLogEntry {
  type = EBucketLE_Type.CREATE_REPLICA;
  replicaCategory: EReplicaCategoryType;
  replicaType: ReplicaType;
  id: ReplicaId;

  constructor(c: EReplicaCategoryType, t: ReplicaType, id: ReplicaId) {
    this.replicaCategory = c;
    this.replicaType = t; 
    this.id = id;
  }

  static create_common_replica(t: ECommonReplicaType, id: ReplicaId): BucketLE_CreateReplica {
    return new BucketLE_CreateReplica(EReplicaCategoryType.COMMON, t, id);
  }

  static create_client_replica(t: ClientReplicaType, id: ReplicaId): BucketLE_CreateReplica {
    return new BucketLE_CreateReplica(EReplicaCategoryType.CLIENT, t, id);
  }

  static create_document(t: DocumentSchemaType, id: ReplicaId): BucketLE_CreateReplica {
    return new BucketLE_CreateReplica(EReplicaCategoryType.DOCUMENT, t, id);
  }
}

export class BucketLE_DestroyReplica implements IBucketLogEntry {
  type = EBucketLE_Type.DESTROY_REPLICA;
  id_: ReplicaId;

  constructor(id: ReplicaId) {
    this.id_ = id;
  }

  static create(id: ReplicaId): BucketLE_DestroyReplica {
    return new BucketLE_DestroyReplica(id);
  }
}

export class BucketLE_UpdateReplica implements IBucketLogEntry {
  type = EBucketLE_Type.UPDATE_REPLICA;
  id_: ReplicaId;
  logs: IArrayReplicaOLog;

  constructor(id: ReplicaId, logs: IArrayReplicaOLog){
    this.id_ = id;
    this.logs = logs;
  }

  static create(id: ReplicaId, logs: IArrayReplicaOLog): BucketLE_UpdateReplica {
    return new BucketLE_UpdateReplica(id, logs);
  }
}

export class BucketLE_InsertDocumentSchema implements IBucketLogEntry {
  type = EBucketLE_Type.INSERT_DOCUMENT_SCHEMA;
  schema: DocumentSchema;

  constructor(schema: DocumentSchema) {
    this.schema = schema;
  }

  static create(schema: DocumentSchema): BucketLE_InsertDocumentSchema {
    return new BucketLE_InsertDocumentSchema(schema);
  }
}

export class BucketLE_RemoveDocumentSchema implements IBucketLogEntry {
  type = EBucketLE_Type.REMOVE_DOCUMENT_SCHEMA;
  id: DocumentSchemaType;

  constructor(id: DocumentSchemaType) {
    this.id = id;
  }

  static create(id: DocumentSchemaType): BucketLE_RemoveDocumentSchema {
    return new BucketLE_RemoveDocumentSchema(id);
  }
}