export interface PickerOption {
  body: string | Node;
  disabled?: boolean;
  footer?: string | Node;
  /** Must be unique within the list: the selected tile is matched by value, so duplicates select several tiles at once. */
  value: string;
}
