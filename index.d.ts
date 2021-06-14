/**
 * Wraps all available functions that are callable from within functions
 * inside of the platform.
 */
declare interface Platform {
  deployConnector: (
    connector: ConnectorDescription
  ) => void;
  deployTimer: (...argumentList: any[]) => void;
  addEntity: (id: string, state: any) => void;
  store: (key: string, value: any) => void;
  get: (key: string) => Promise<any>;
  log: (...whatToLog: any[]) => void;
  entity: (id: string) => EntityCursor;
  findEntities: (restrictions: EntityRestrictions) => Promise<any[]>;
  func: (name: string) => any;
  sendConnectorEvent: (
    connectorId: number,
    type: string,
    payload: any
  ) => Promise<void>;
  call: (
    functionCall: APIFunctionCallDescription
  ) => Promise<any>;
  insertState: (
    entityId: string,
    property: string,
    value: any,
    time?: number
  ) => Promise<any>;
  inquire: Function;
  makeEntity: (entity: Entity, time: number) => Promise<void>;

  init: Function;
}

interface ConnectorDescription {
    type: string;
    name: string;
    parameters?: { [key: string]: any };
}

type APIFunctionCallDescription = {
  entityId?: string;
  function: string;
  parameters?: any;
};

type EntityStateValue = any;

interface EntityState {
  time: number; // in UTC
  value: EntityStateValue;
  type?: string; // TODO: make this an enum
}

function instanceOfEntityState(object: any): object is EntityState {
  return typeof object === 'object' && 'time' in object && 'value' in object;
}

interface EntityStateDictionary {
  [key: string]: EntityState | EntityStateValue;
}

interface Entity {
  id?: string | number;
  providedby?: number;
  pid?: string | number;
  type?: string;
  methods?: any;
  name: string;
  state: EntityStateDictionary;
}

interface EntityRestrictions {
  type?: String;
  parameters?: Object;
}

interface EntityHistoryRestrictions {
  from?: Number;
  to?: Number;
  property?: String;
}

interface EntityCursor {
  history(restrictions: EntityHistoryRestrictions): Promise<any>;
  state: (property: string) => {
    from: (startDateTime: string | number) => {
      to: (endDateTime: string | number) => Promise<any>,
    },
    at: (dateTime: string | number) => Promise<any>;
  }
}
