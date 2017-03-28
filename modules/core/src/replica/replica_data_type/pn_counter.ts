import {IReplicaState, ReplicaId, ReplicaLocalId, EReplicaCategoryType, ECommonReplicaType, IReplicaLogger, log} from '../../types'

export type Value = number;

export class State implements IReplicaState {
  id: ReplicaId;
  lid: ReplicaLocalId;
  n_: number;

  constructor() {
    this.n_ = 0;
  }

  value(): Value {
    return this.n_;
  }

  reset() {
    this.n_ = 0;
  }
}
State.prototype['category'] = EReplicaCategoryType.COMMON;
State.prototype['type'] = ECommonReplicaType.PN_COUNTER;

export const enum ELogType {
  OP_INC,
  OP_DEC
}

export type OLog = {type:ELogType, d:number};

export class Logger implements IReplicaLogger {
  private logs_: Array<OLog> = [];

  increment(i: number) {
    this.logs_.push({type: ELogType.OP_INC, d:i})
  }

  decrement(i: number) {
    this.logs_.push({type: ELogType.OP_DEC, d:i})
  }

  build(): Array<OLog> {
    return this.logs_;
  }
}

export function compact(a: Array<OLog>): Array<OLog> {
  let accu = 0;

  for(let i= 0, size_a=a.length; i<size_a; i++) {
    switch(a[i].type) {
      case ELogType.OP_INC: accu += a[i].d; break;
      case ELogType.OP_DEC: accu -= a[i].d; break;
      default: log.error("--- PNCounter compact  error"); // TODO
    }
  }

  let logs = new Array<OLog>(1);

  if (accu >= 0){
    logs[0].type = ELogType.OP_INC;
    logs[0].d = accu
  } else {
    logs[0].type = ELogType.OP_DEC;
    logs[0].d = Math.abs(accu);
  }

  return logs;
} 

export function merge_and_compact(a: Array<OLog>, b:Array<OLog>): Array<OLog> {
  if (a.length === 0)
    return compact(b);

  let accu = 0;

  for(let i= 0, size_a=a.length; i<size_a; i++) {
    switch(a[i].type) {
      case ELogType.OP_INC: accu += a[i].d; break;
      case ELogType.OP_DEC: accu -= a[i].d; break;
      default: log.error("--- PNCounter merge_and_compact  error1"); // TODO
    }
  }

  for(let i= 0, size_b=b.length; i<size_b; i++) {
    switch(b[i].type) {
      case ELogType.OP_INC: accu += b[i].d; break;
      case ELogType.OP_DEC: accu -= b[i].d; break;
      default: log.error("--- PNCounter merge_and_compact  error2"); // TODO
    }
  }
  
  if(a.length > 1)
    a=a.slice(0,1);

  if (accu >= 0){
    a[0].type = ELogType.OP_INC;
    a[0].d = accu
  } else {
    a[0].type = ELogType.OP_DEC;
    a[0].d = Math.abs(accu);
  }

  return a;
}

export function apply(s: State, logs: Array<OLog>) {
  let l = logs.length;

  for(let iL= 0; iL<l; iL++){
    switch(logs[iL].type){
      case ELogType.OP_INC:
        s.n_ += logs[iL].d;
      break;
      case ELogType.OP_DEC:
        s.n_ -= logs[iL].d;
      break;
      default:
        log.error("--- PNCounter aplpy error"); // TODO
    }
  }
}