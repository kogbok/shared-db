import {IReplicaState, BucketId, ReplicaId, DocumentSchema, DocumentSchemaType} from '../types'

export interface IDocumentSchemaResolver {
  get_document_schema(id: DocumentSchemaType, bId: BucketId): DocumentSchema;
}

export interface IQueryResolver extends IDocumentSchemaResolver {
  get_value<T extends IReplicaState>(bucket_id: BucketId, id: ReplicaId): any;
}
