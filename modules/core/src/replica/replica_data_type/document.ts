import {IReplicaState, ReplicaId, ReplicaLocalId, DocumentSchemaType, EReplicaCategoryType, IArrayReplicaOLog, IReplicaLogger} from '../../types'
import {apply_on_replica} from '../factory'


export type Value = any;

export class State implements IReplicaState {
  type: DocumentSchemaType;
  id: ReplicaId;
  lid: ReplicaLocalId;

  value(): Value {
    return create_value(this);
  }
}
State.prototype['category'] = EReplicaCategoryType.DOCUMENT;

export function create_value(state: State): Value {
  let v = {};

  for(let k in state) {
    if (typeof state[k] === 'object') v[k] = state[k].value();
    else                              v[k] = state[k];
  }

  return v;
}

export type OLog = {[key: string]: IArrayReplicaOLog};

export class Logger implements IReplicaLogger {  
  private logs_: Array<OLog>;

  constructor() {
    this.logs_ = [];
  }

  push(name: string, rol: IArrayReplicaOLog) {
    this.logs_.push({name: rol}); // TODO a tester
  }

  build(): Array<OLog> {
    return this.logs_;
  }
}

export function create_logger(): Logger {
  return new Logger();
}

export function apply(s: State, rls: Array<OLog>) {
  for(let iL= 0, l=rls.length; iL<l; iL++){
    let key = Object.keys(rls[iL])[0];
    apply_on_replica(s[key], rls[iL][key]); //TODO a verifier
  }
}