import { Button } from "@/components/ui/button";

type FormBtnSubmit = {
  readonly canSubmit: boolean;
  readonly isSubmitting: boolean;
}

export default function FormButtonSubmit({ canSubmit, isSubmitting }: FormBtnSubmit) {
  return (
    <Button type="submit" disabled={!canSubmit} >
      {isSubmitting ? "..." : 'Soumettre'}
    </Button>
  )
}