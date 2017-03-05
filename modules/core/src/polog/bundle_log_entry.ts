import {BucketId, EReplicaCategoryType, ReplicaType, IArrayReplicaOLog, DocumentSchema, DocumentSchemaType, ReplicaId} from '../types'
import {BucketParameters, ITransactionLE, ETransactionLE_Type, TransactionLE_CreateBucket, TransactionLE_DestroyBucket, TransactionLE_UpdateBucket} from './transaction_log_entry'
import {EBucketLE_Type, BucketLE_CreateReplica, BucketLE_DestroyReplica, BucketLE_UpdateReplica, BucketLE_InsertDocumentSchema, BucketLE_RemoveDocumentSchema} from './bucket_log_entry'

//TODO ajout data structure for causality constraint ? (dotted version vector ?)
export class BundleBucketLE {
  private replica_created_: {[key: string/*ReplicaId*/]: {
    category: EReplicaCategoryType,
    type: ReplicaType
  }} = {};
  private replica_deleted_: Array<string/*ReplicaId*/> = [];
  private replica_updated_: {[key: string/*ReplicaId*/]: IArrayReplicaOLog} = {};
  private document_schemas_created_: {[key: string/*DocumentSchemaType*/]: DocumentSchema} = {}; 
  private document_schemas_deleted_: Array<string/*DocumentSchemaType*/> = []; 

  //causality constraint: this < other or this || other
  append (other: BundleBucketLE) { 
    //TODO create assert for causality constraint

    // replica
    //-- -- -- -- -- -- -- -- -- -- -- -- -- --
      // updated
        // if this.replica_updated are deleted in other, we delete switch
    Object.keys(other.replica_deleted_)
      .filter(k => { return this.replica_updated_.hasOwnProperty(k); })
      .forEach(k => delete this.replica_updated_[k]);

        // if other.replica_updated are deleted in this, we delete switch
    Object.keys(other.replica_updated_)
      .filter(k => { return this.replica_deleted_.indexOf(k) <= -1; })
      .forEach(k => {
        if (this.replica_updated_.hasOwnProperty(k))
          Array.prototype.push.apply(this.replica_updated_[k], other.replica_updated_[k]); // TODO voir si on merge les IArrayReplicaOLog du même replica
        else
          this.replica_updated_[k] = other.replica_updated_[k];
      });

      // deleted
        // if replica id deleted in this and in other we juste keep one
    let replica_deleted_ids_to_add = other.replica_deleted_.filter((v) => { return this.replica_deleted_.indexOf(v) <= -1; });
    Array.prototype.push.apply(this.replica_deleted_, replica_deleted_ids_to_add);

      // created
        // if this.replica_created are deleted in other, we delete it
    Object.keys(other.replica_deleted_)
      .filter((k) => { return this.replica_created_.hasOwnProperty(k); })
      .forEach(k => delete this.replica_created_[k]);
        // concat this.created with other.created
    Object.assign(this.replica_created_, other.replica_created_);

    // document_schema
    //-- -- -- -- -- -- -- -- -- -- -- -- -- --
      // deleted
        // if document_schema deleted in this and in other we just keep one
    let document_schemas_deleted_to_add = other.document_schemas_deleted_.filter((v) => { return this.document_schemas_deleted_.indexOf(v) <= -1; });
    Array.prototype.push.apply(this.document_schemas_deleted_, document_schemas_deleted_to_add);
    
      // created
        // if this.document_schemas_created are deleted in other, we delete it
    Object.keys(other.document_schemas_deleted_)
      .filter((k) => {return this.document_schemas_created_.hasOwnProperty(k); })
      .forEach(k => delete this.document_schemas_created_[k]);
        // concat
    Object.assign(this.document_schemas_created_, other.document_schemas_created_);
  }

  get_replica_type_if_created(id: ReplicaId): {category: EReplicaCategoryType, type: ReplicaType} {
    if (this.replica_created_.hasOwnProperty(id))
      return this.replica_created_[id];
    return null;
  }

  is_replica_deleted(id: ReplicaId): boolean {
    return this.replica_deleted_.indexOf(id) > -1;
  }

  get_replica_polog_if(id: ReplicaId): IArrayReplicaOLog {
    if (this.replica_updated_.hasOwnProperty(id))
      return this.replica_updated_[id];
    return null;
  }

  get_document_schema_if_created(type: DocumentSchemaType): DocumentSchema {
    if (this.document_schemas_created_.hasOwnProperty(type))
      return this.document_schemas_created_[type];
    return null;
  }
  
  is_document_schema_deleted(type: DocumentSchemaType): boolean {
    return this.document_schemas_deleted_.indexOf(type) > -1; 
  }

  clear() {
    this.replica_created_ = {};
    this.replica_deleted_ = [];
    this.replica_updated_ = {};
    this.document_schemas_created_ = {}; 
    this.document_schemas_deleted_ = []; 
  }

  static create_from_transaction_update_bucket(ub: TransactionLE_UpdateBucket) : BundleBucketLE {
    let ble = new BundleBucketLE();
    for (let iL=0, lL=ub.logs.length; lL>iL; iL++){
      switch(ub.logs[iL].type) {
        case EBucketLE_Type.CREATE_REPLICA:
          let cr = ub.logs[iL] as BucketLE_CreateReplica;
          ble.replica_created_[cr.id] = {category: cr.replicaCategory, type: cr.replicaType};
        break;
        case EBucketLE_Type.DESTROY_REPLICA:
          let dr = ub.logs[iL] as BucketLE_DestroyReplica;
          if (ble.replica_deleted_.indexOf(dr.id_) <= -1)
            ble.replica_deleted_.push(dr.id_);
        break;
        case EBucketLE_Type.UPDATE_REPLICA:
          let ur = ub.logs[iL] as BucketLE_UpdateReplica;
          if (ble.replica_updated_.hasOwnProperty(ur.id_))
            Array.prototype.push.apply(ble.replica_updated_[ur.id_], ur.logs); // TODO voir si on merge les IArrayReplicaOLog du même replica
          else
            ble.replica_updated_[ur.id_] = ur.logs;
        break;
        case EBucketLE_Type.INSERT_DOCUMENT_SCHEMA:
          let ids = ub.logs[iL] as BucketLE_InsertDocumentSchema;
          ble.document_schemas_created_[ids.type] = ids.schema;
        break;
        case EBucketLE_Type.REMOVE_DOCUMENT_SCHEMA:
          let rds = ub.logs[iL] as BucketLE_RemoveDocumentSchema;
          if (ble.document_schemas_deleted_.indexOf(rds.id) <= -1)
            ble.document_schemas_deleted_.push(rds.id);
        break;
        default:
          throw new Error("BundleBucketLE::create_from_transactions_le unknow ETransactionLE_Type");
      }
    }
    return ble;
  }
}


export class BundleLE {
  private bucket_updated_: {[key:string/*BucketId*/]: BundleBucketLE} = {};
  private bucket_deleted_: Array<string/*BucketId*/> = [];
  private bucket_created_: {[key:string/*BucketId*/]: {parameters: BucketParameters}} = {};

  //causality constraint: this < other or this || other
  append(other: BundleLE) {
    //TODO create assert for causality constraint

    // updated
    Object.keys(other.bucket_deleted_)
      .filter((k => { return this.bucket_updated_.hasOwnProperty(k) }))
      .forEach(k => delete this.bucket_updated_[k]);

    Object.keys(other.bucket_updated_)
      .filter(k => {return this.bucket_deleted_.indexOf(k) <= -1})
      .forEach(k => {
        if (!this.bucket_updated_.hasOwnProperty(k))
          this.bucket_updated_[k] = other.bucket_updated_[k];
        else
          this.bucket_updated_[k].append(other.bucket_updated_[k]);
      });

    // deleted
    let deleted_to_add = Object.keys(other.bucket_deleted_).filter((v) => {return this.bucket_deleted_.indexOf(v) <= -1;});
    Array.prototype.push.apply(this.bucket_deleted_, deleted_to_add);

    // created
    Object.keys(other.bucket_deleted_)
      .filter((k) => { return this.bucket_created_.hasOwnProperty(k); })
      .forEach(k => delete this.bucket_created_[k]);

    Object.assign(this.bucket_created_, other.bucket_created_);
  }

  get_bucket_parameters_if_created(id: BucketId): {parameters: BucketParameters} {
    if (this.bucket_created_.hasOwnProperty(id))
      return this.bucket_created_[id];
    return null;
  }

  is_bucket_deleted(id: BucketId): boolean {
    return this.bucket_deleted_.indexOf(id) > -1;
  }

  get_bucket_polog_if(id: BucketId): BundleBucketLE {
    if (this.bucket_updated_.hasOwnProperty(id))
      return this.bucket_updated_[id];
    return null;
  }

  clear() {
    this.bucket_updated_ = {};
    this.bucket_deleted_ = [];
    this.bucket_created_ = {};
  }

  static create_from_transactions_le(tle: Array<ITransactionLE>) : BundleLE {
    let ble = new BundleLE();
    for(let iT=0, lT=tle.length; lT>iT; iT++) {
      switch(tle[iT].type) {
        case ETransactionLE_Type.CREATE_BUCKET:
          let cb = tle[iT] as TransactionLE_CreateBucket; 
          ble.bucket_created_[cb.id] = {parameters: cb.parameters};
        break;
        case ETransactionLE_Type.DESTROY_BUCKET:
          let db = tle[iT] as TransactionLE_DestroyBucket;
          ble.bucket_deleted_.push(db.id);
        break;
        case ETransactionLE_Type.UPDATE_BUCKET:
          let ub = tle[iT] as TransactionLE_UpdateBucket;
          ble.bucket_updated_[ub.bucket_id] = BundleBucketLE.create_from_transaction_update_bucket(ub);
        break;
        default:
          throw new Error("BundleLE::create_from_transactions_le unknow EBucketLE");
      }
    }
    return ble; 
  }
}
