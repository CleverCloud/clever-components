export interface FtFormState {
  state: "idle" | "submitting";
  name: NameFormField;
  email: EmailFormField;
}

interface NameFormField {
  value: string,
  error?: NameFormFieldError;
}

type NameFormFieldError = "empty";

interface EmailFormField {
  value: string;
  error?: EmailFormFieldError;
}
type EmailFormFieldError = "empty" | "invalid" | "already-used";
