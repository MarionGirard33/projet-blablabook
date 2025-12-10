import { Input } from "@/components/ui/input";
import type { AnyFieldApi } from "@tanstack/react-form"

type FormInputProps = {
  readonly field: AnyFieldApi;
  readonly type: string;
  readonly placeholder: string;
}

export default function FormInput({ field, type, placeholder }: FormInputProps) {
  return (
    <Input
      type={type}
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  )
}
