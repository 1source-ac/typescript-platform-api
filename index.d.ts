/**
 * The main entry point to the platform api.
 */
declare interface Platform {
  deployConnector: (connector: ConnectorDescription) => void;
  deployTimer: (...argumentList: any[]) => void;
  addEntity: (id: string, state: any) => void;
  store: (key: string, value: any) => Promise<void>;
  get: (key: string) => Promise<any>;
  log: (...whatToLog: any[]) => void;
  entity: (id: string) => Promise<Entity>;
  sendConnectorEvent: (
    connectorId: number,
    type: string,
    payload: any
  ) => Promise<void>;
  call: (functionCall: APIFunctionCallDescription) => Promise<any>;
  insertState: (
    entityId: string,
    property: string,
    value: any,
    time?: number
  ) => Promise<any>;
  inquire: Function;
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

interface EntityState {
  time: number; // in UTC
  value: any;
  type?: string; // TODO: make this an enum
}

interface EntityStateDictionary {
  [key: string]: EntityState;
}

interface Entity {
  id: string | number;
  name: string;
  state: EntityStateDictionary;
}
