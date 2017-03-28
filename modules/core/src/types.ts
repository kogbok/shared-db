import {ILogger, logger} from './tools/logging'

//  log
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export let log: ILogger = logger('shared_database');

//  status
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export const enum EStatusCode {
  OK,
  INVALID_ARGUMENT
}

export class Status {
  private code_: EStatusCode = null;
  private msg_: string = null;

  constructor(code: EStatusCode, msg: string) {
    this.code_ = code;
    this.msg_  = msg;
  }

  ok(): boolean {
    return (this.code_ === EStatusCode.OK);
  }

  static create_ok(): Status {
    return g_status_ok;
  }

  static create_invalid_argument(msg: string): Status {
    return new Status(EStatusCode.INVALID_ARGUMENT, msg);
  }
}
const g_status_ok = new Status(EStatusCode.OK, "");

//  misc
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export class Output<T> {
  data: T = null;
}

//  id type
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export type UUID           = string;
export type ActorId        = UUID;
export type BucketId       = UUID;
export type ReplicaId      = UUID;
export type ReplicaLocalId = number;

//  replica type
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export const enum ECommonReplicaType { // COMMON
  PN_COUNTER,
  NB_ELEMENT
}

export type ClientReplicaType = UUID;
export type DocumentSchemaType  = UUID;

export type ReplicaType = ECommonReplicaType|ClientReplicaType|DocumentSchemaType;

export class EDocumentSchemaReplicaCategory {
  static COMMON   = "common";
  static CLIENT   = "client";
  static DOCUMENT = "document";
}

export class EDocumentSchemaCommonReplicaType {
  static PN_COUNTER = "pn-counter";
  static U_SET      = "u-set";
}

export type DocumentSchema = {
  type: DocumentSchemaType,
  //id: UUID, why???
  properties:{
    [key:string]:{
      category:string, // € EDocumentSchemaReplicaCategory
      type:string      // if (category == EDocumentSchemaReplicaCategory.COMMON) € EDocumentSchemaReplicaType
    }
  }
};

//  replica interface
//  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export const enum EReplicaCategoryType {
  COMMON,
  CLIENT,
  DOCUMENT
}

export interface IArrayReplicaOLog { // array of replica operation log
  length:number;
}

export interface IReplicaState {
  category?: EReplicaCategoryType;
  type?: ReplicaType;
  id: ReplicaId;
  lid: ReplicaLocalId;
  value(): any;
}

export interface IReplicaLogger {
  build(): IArrayReplicaOLog;
}

export type StateMap = {[key:string]:IReplicaState};
export type OLogMap = {[key:string]:IArrayReplicaOLog};