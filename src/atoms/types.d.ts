export interface Choice {
  label: string,
  image?: string,   // Optional URL of an image
  value: string,
}

export type PositionType = "top-left" | "bottom-left" | "top-right" | "bottom-right";

export type IframeSandbox = "allow-forms" | "allow-modals" | "allow-pointer-lock" | "allow-popups" | "allow-popups-to-escape-sandbox" | "allow-same-origin" | "allow-scripts" | "allow-top-navigation";
