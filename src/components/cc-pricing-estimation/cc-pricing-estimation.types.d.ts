export type ActionType = "add" | "none";

export interface Currency {
  code: string,
  changeRate: number,
}

export interface Feature {
  code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version",
  type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
  value?: number | string, // Only required for a plan feature
}

export interface Interval {
  minRange: number, // byte
  maxRange: number, // byte
  price: number,    // "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
}

export interface Plan {
  productName: string,
  name: string,
  price: number, // price in euros for 1 hour
  features: Feature[],
  quantity: number,
}

export interface Section {
  type: SectionType,
  intervals?: Interval[],
}

export type SectionType = "storage" | "inbound-traffic" | "outbound-traffic";

export interface Temporality {
  type: "second" | "minute" | "hour" | "day" | "30-days",
  digits: number, // how many fraction digits to display the price
}
