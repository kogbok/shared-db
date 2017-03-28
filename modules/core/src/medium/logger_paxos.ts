import {ActorId} from '../types'

export module logger_paxos {

export interface ILogger {
  put();
  read_since();
}

export class Acceptor {
  private actor_id_: ActorId;
  private logger_: ILogger;

  send(msg: AcceptorMessage) {
    this.logger_.put();
  }
}

export type AcceptorMessage = {};

export class AcceptorSet {
  private acceptors_: Array<Acceptor>;

  send(msg: AcceptorMessage) {
    for (let a of this.acceptors_) {
      a.send(msg);
    }
  }
}


export class Proposer {
  private actor_id_: ActorId;
  private logger_: ILogger;

  propose() {
    
  }
}



}