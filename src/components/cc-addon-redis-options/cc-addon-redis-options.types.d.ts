interface Option {
  name: string;
  enabled: boolean;
  // Option specific params
  flavor: Flavor; // for "apm" and "kibana" options
  price: number; // for "encryption" option
}

interface Flavor {
  name: string;
  cpus: number;
  gpus: number;
  mem: number;
  microservice: boolean;
  monthlyCost: number;
}

interface GenericOptions {
  encryption: boolean;
}
