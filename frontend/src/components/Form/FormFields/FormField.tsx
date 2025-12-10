import { Label } from "@radix-ui/react-label";
import type { AnyFieldApi } from "@tanstack/react-form"
import FormFieldInfo from "./FormFieldInfo";
import FormInput from "./FormInput";

type FormFieldProps = {
  readonly field: AnyFieldApi;
  readonly type: string;
  readonly label: string;
  readonly placeholder: string;
}

export default function FormField({ field, type, label, placeholder }: FormFieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3 my-3">
      <Label htmlFor="email">{label} :</Label>
      <FormInput type={type} field={field} placeholder={placeholder} />
      <FormFieldInfo field={field} />
    </div>
  )
}
