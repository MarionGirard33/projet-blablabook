import api from "@/api/axios";
import FormAction from "@/components/Form/FormAction/FormAction";
import FormField from "@/components/Form/FormFields/FormField";
import FormTitle from "@/components/Form/FormTitle";
import { useAuthStore } from "@/stores/authStore";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur doit être définis"),
  password: z.string().min(1, "Le mot de passe est attendu"),
});

type LoginFormData = {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return api.post("/auth/login", data);
    },
    onSuccess: (response) => {
      authStore.login(response.data);
      navigate({ to: "/" })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Erreur serveur: ", error.message)
    }
  })

  const defaultValues = {
    username: "",
    password: "",
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
    validators: {
      onChange: schema
    }
  })

  return (
    <form
      className="w-150 flex flex-col items-center"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >

      <FormTitle title="Connexion" />

      <form.Field name="username">
        {(field) => {
          return <FormField field={field} type={"string"} label={"Nom d'utilisateur"} placeholder={""} />
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          return <FormField field={field} type={"password"} label={"Mot de passe"} placeholder={""} />
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <FormAction
            form={form}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  )
}