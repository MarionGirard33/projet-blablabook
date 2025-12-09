import { Button } from "@/components/ui/button";
import type { AnyFormApi } from "@tanstack/react-form";

type FormBtnReset = {
  readonly form: AnyFormApi;
}

export default function FormBtnReset({ form }: FormBtnReset) {
  return (
    <Button
      type="reset"
      variant="secondary"
      onClick={(e) => {
        e.preventDefault()
        form.reset()
      }}
    >
      Effacer
    </Button>
  )
}