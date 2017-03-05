import {IArrayReplicaOLog, replica} from 'sdb_core'
import {IReplicaUpdater} from '../../../types'
import {PNCounterUpdater} from './pncounter_updater'

export class DocumentUpdater implements IReplicaUpdater {
  private updater_: {[key: string]: IReplicaUpdater};

  constructor() {
    this.updater_ = {};
  }

  pncounter(name: string): PNCounterUpdater {
    if (!this.updater_.hasOwnProperty(name))
      this.updater_[name] = new PNCounterUpdater();
    return this.updater_[name] as PNCounterUpdater;
  }

  document(name: string): DocumentUpdater {
    if (!this.updater_.hasOwnProperty(name))
      this.updater_[name] = new DocumentUpdater();
    return this.updater_[name] as DocumentUpdater;
  }

  build(): IArrayReplicaOLog {
    let l = replica.Document.create_logger();

    for (let k in this.updater_){
      l.push(k, this.updater_[k].build());
    }

    return l.build();
  }
}
