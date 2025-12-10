import type { AnyFormApi } from "@tanstack/react-form";
import FormBtnReset from "./FormBtnReset";
import FormButtonSubmit from "./FormBtnSubmit";

type FormActionProps = {
  readonly canSubmit: boolean;
  readonly isSubmitting: boolean;
  readonly form: AnyFormApi;
}

export default function FormAction({ canSubmit, isSubmitting, form }: FormActionProps) {
  return (
    <div className="my-10 flex justify-center gap-x-4">
      <FormBtnReset form={form} />
      <FormButtonSubmit canSubmit={canSubmit} isSubmitting={isSubmitting} />
    </div >
  )
}