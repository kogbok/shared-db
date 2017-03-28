import {BucketId, IBucketLogEntry, ReplicaId, ReplicaType, DocumentSchema, create_replica_id, TransactionLE_UpdateBucket, IReplicaLogger, BucketLE_RemoveDocumentSchema, BucketLE_CreateReplica, BucketLE_InsertDocumentSchema, BucketLE_UpdateReplica, ECommonReplicaType, BucketLE_DestroyReplica, ClientReplicaType, DocumentSchemaType} from 'sdb_core'
import {IBucketUpdater} from '../../types'

function is_common_replica_type(type){return typeof type === "number";} // TODO
function is_document_type(a){return true;} // TODO

export class  BucketUpdater implements IBucketUpdater {
  private logs_: Array<IBucketLogEntry> = [];
  private bucket_id_: BucketId;

  constructor(bucket_id: BucketId) {
    this.bucket_id_ = bucket_id;
  }
  
  /**
   * create common replica
   */
  create_replica(type: ReplicaType): ReplicaId {
    let id = create_replica_id();
    if (is_common_replica_type(type))
      this.logs_.push(BucketLE_CreateReplica.create_common_replica(type as ECommonReplicaType, id));
    else if (is_document_type(type))
      this.logs_.push(BucketLE_CreateReplica.create_document(type as ClientReplicaType, id));
    else
      this.logs_.push(BucketLE_CreateReplica.create_client_replica(type as DocumentSchemaType, id));

    return id;
  }

  delete_replica(id: ReplicaId): BucketUpdater {
    this.logs_.push(BucketLE_DestroyReplica.create(id));
    return this;
  }

  update_replica(id: ReplicaId, l: IReplicaLogger): BucketUpdater {
    //TODO verifier le type du replica et celui du IReplicaLogger
    this.logs_.push(BucketLE_UpdateReplica.create(id, l.build()));
    return this;
  }

  insert_document_schema(schema: DocumentSchema): BucketUpdater {
    //TODO check if not present
    this.logs_.push(BucketLE_InsertDocumentSchema.create(schema));
    return this;
  }

  remove_document_schema(id: DocumentSchemaType): BucketUpdater {
    //TODO check is present
    this.logs_.push(BucketLE_RemoveDocumentSchema.create(id));
    return this;
  }

  build(): TransactionLE_UpdateBucket {
    return TransactionLE_UpdateBucket.create(this.bucket_id_, this.logs_);
  }
  // createSpecificReplica(type: SpecificReplicaType): ReplicaId {

  // }

  // createDocument(s: DocumentSchema): DocumentId {

  // }
}
