import {BucketId, ReplicaId, ECommonReplicaType, EReplicaCategoryType, EDocumentSchemaCommonReplicaType, EDocumentSchemaReplicaCategory} from '../types'

declare var require: any;
var UUID = require('uuid');

function create_id(): string {
  return UUID.v4();
}

export function create_bucket_id(): BucketId {
  return create_id();
}

export function create_replica_id(): ReplicaId {
  return create_id();
}

export function string_to_common_replica_type(s: string): ECommonReplicaType {
  switch(s) {
    case EDocumentSchemaCommonReplicaType.PN_COUNTER:
      return ECommonReplicaType.PN_COUNTER;
     default:
       throw "error in string_to_common_replica_type";
  }
}

export function string_to_replica_category_type(s: string): EReplicaCategoryType {
  switch(s) {
    case EDocumentSchemaReplicaCategory.COMMON:
      return EReplicaCategoryType.COMMON;
    case EDocumentSchemaReplicaCategory.CLIENT:
      return EReplicaCategoryType.CLIENT;
    case EDocumentSchemaReplicaCategory.DOCUMENT:
      return EReplicaCategoryType.DOCUMENT;
   default:
     throw "error in string_to_replica_category_type";
  }
}