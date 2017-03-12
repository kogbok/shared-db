import {ActorId} from '../types'

export module logger_paxos {

export interface ILogger {
  write();
  read();
}

export class Acceptor {
  private actor_id_: ActorId;
  private logger_: ILogger;
}

export class Proposer {
  private actor_id_: ActorId;
  private logger_: ILogger;

  propose() {
    
  }
}

}