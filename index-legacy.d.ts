/**
 * Wraps all available functions that are callable from within functions
 * inside of the platform.
 */
declare interface Platform {
  /**
  Deploys a connector to the platform with the given description.
  */
  deployConnector: (
    connector: ConnectorDescription
  ) => void;

  /**
  Deploys a timer to the platform with the specified arguments.
  */
  deployTimer: (...argumentList: any[]) => void;

  /**
  Adds an entity with the specified ID and state to the platform.
  */
  addEntity: (id: string, state: any) => void;

  /**
  Executes sql query and asynchronously returns resulting sql rows.
  */
  sql: (query: string, parameters?: any) => Promise<any[]>;

  /**
  Stores a key-value pair in the platform's storage.
  */
  store: (key: string, value: any) => void;

  /**
  Returns a Promise that resolves to the value.
  */
  get: (key: string) => Promise<any>;

  /**
  Logs the specified arguments to the platform's logging system.
  */
  log: (...whatToLog: any[]) => void;

  /**  
  Returns an EntityCursor object for the entity with the specified ID.
  */
  entity: (id: string) => EntityCursor;

  /**  
  Finds entities based on the specified restrictions and returns a Promise that resolves to an array of matching entities.
  */
  findEntities: (restrictions: EntityRestrictions) => Promise<any[]>;

  /**  
  Returns an object containing the 'run' method for the function with the specified name.
  */
  func: (name: string) => { run: (arg: any) => Promise<any> };

  /**
  Creates a relationship of the specified type between the two specified entities.
  Returns a Promise that resolves once the relationship is created.
  */
  relate: (first: string | number, type: string, second: string | number) => Promise<void>;

  /**
  Sends a connector event to the specified connector with the given type and payload.
  Returns a Promise that resolves once the event is sent.
  */
  sendConnectorEvent: (
    connectorId: number,
    type: string,
    payload: any
  ) => Promise<void>;
  /**
  
  Calls an external API function with the given description and parameters.
  Returns a Promise that resolves with the API response.
  */
  call: (
    functionCall: APIFunctionCallDescription
  ) => Promise<any>;
  /**
  
  Inserts a state with the specified entityId, property, and value at the given time (optional).
  Returns a Promise that resolves once the state is inserted.
  */
  insertState: (
    entityId: string,
    property: string,
    value: any,
    time?: number
  ) => Promise<any>;
  /**
  
  Calls an inquire function with the specified arguments.
  Note: Function signature and behavior are specific to the platform implementation.
  */

  inquire: Function;

  /**
  
  Creates an entity with the specified properties and optional time.
  Returns a Promise that resolves to the ID of the created entity.
  */
  makeEntity: (entity: Entity, time?: number) => Promise<string | number>;
  /**
  
  Initializes the platform with the specified settings.
  Note: Function signature and behavior are specific to the platform implementation.
  */
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
