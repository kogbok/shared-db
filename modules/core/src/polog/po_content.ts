import {IReplicaState, DocumentSchema} from '../types'

export class DataPOContent {
  buckets: {[key:string/*BucketId*/]: BucketPOContent};
}

export class BucketPOContent {
  replica:{[key:string/*ReplicaId*/]: IReplicaState};
  document_schemas:{[key:string/*DocumentSchemaType*/]: DocumentSchema};
}