  
export interface ILogManager {
  getLogger(name: string): ILogger;
}

export interface ILogger {
  error(msg: string): void;
  warn(msg: string): void;
  info(msg: string): void;
  verbose(msg: string): void;
  debug(msg: string): void;
}

class ConsoleLogger implements ILogger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  error(msg: string) {
    console.error(msg);
  }

  warn(msg: string) {
    console.warn(msg);
  }

  info(msg: string) {
    console.info(msg);
  }

  verbose(msg: string) {
    console.trace(msg);
  }

  debug(msg: string) {
    console.debug(msg);
  }
}

class ConsoleLogManager implements ILogManager {
  getLogger(name: string): ILogger {
    return new ConsoleLogger(name);
  }
}

export function logger(name: string): ILogger {
  return logManager.getLogger(name)
} 

let logManager: ILogManager = new ConsoleLogManager();

export function setLogManager(lm: ILogManager) {
  logManager = lm;
}
