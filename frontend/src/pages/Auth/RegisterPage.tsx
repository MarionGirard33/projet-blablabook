import FormTitle from "./Components/FormTitle";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import type { AxiosError } from "axios";
import { useForm } from "@tanstack/react-form";
import FormField from "./Components/FormFields/FormField";
import FormAction from "./Components/FormAction/FormAction";

const schema = z.object({
  email: z.email("Email invalide").trim(),
  username: z.string().min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères").trim(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").trim(),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe").trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "La confirmation du mot de passe a échouée",
  path: ['confirmPassword'],
});

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string
}

export default function RegisterPage() {
  // const navigate = useNavigate();
  // const authStore = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return api.post("/auth/register", data);
    },
    onSuccess: (response) => {
      console.log(response);
      // TODO: implémenter lorsque le back sera OK
      // authStore.login(response.data);
      // navigate({ to: "/" })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Erreur serveur: ", error.message);
    }
  });

  const defaultValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
      className="border w-150"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >

      <FormTitle title="Inscription" />

      <form.Field name="email">
        {(field) => {
          return <FormField field={field} type={"email"} label={"Email"} placeholder={""} />
        }}
      </form.Field>

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

      <form.Field name="confirmPassword">
        {(field) => {
          return <FormField field={field} type={"password"} label={"Confirmation du mot de passe"} placeholder={""} />
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