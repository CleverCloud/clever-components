export interface Consumption {
  yesterday: number,
  last30Days: number,
}

export interface Deployment {
  state: string,
  action: string,
  date: string,
  logsUrl: string,
}

export interface Flavor {
  name: string,
  cpus: number,
  gpus: number,
  mem: number,
  microservice: boolean,
}

export interface Instance {
  flavourName: string,
  count: number,
}

export interface InstancesState {
  running: Instance[],
  deploying: Instance[],
}

export type ModeType = "app" | "orga";

export type RequestsData = [
  number, // Start timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // End timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // Number of request during this time window.
]

export interface Scalability {
  minFlavor: Flavor,
  maxFlavor: Flavor,
  minInstances: number,
  maxInstances: number,
}

interface StatusCodesData {
  // Status code number as property.
  // Number of requests as value.
  [index: number]: number,
}


