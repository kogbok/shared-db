import {IArrayReplicaOLog, replica, ECommonReplicaType, common_replica_logger_creators} from 'sdb_core'
import {IReplicaUpdater} from '../../../types'

export class PNCounterUpdater implements IReplicaUpdater {
  private delta_: number;

  constructor(delta: number = 0){
    this.delta_ = delta;
  }

  increment(delta: number): PNCounterUpdater {
    this.delta_ += delta;
    return this;
  }

  decrement(delta: number): PNCounterUpdater {
    this.delta_ -= delta;
    return this;
  }
 
  build(): IArrayReplicaOLog {
    let l = common_replica_logger_creators[ECommonReplicaType.PN_COUNTER]() as replica.PNCounter.Logger;

    if (this.delta_ >= 0) l.increment(this.delta_);
    else                  l.decrement(Math.abs(this.delta_));

    return l.build();
  }
}
