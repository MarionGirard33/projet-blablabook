import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useUpdateUser } from "./mutation/updateUser.mutation";
import type { UpdateUserInput } from "./@types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UpdateUserFormProps = {
  userId: number;
  onClose?: () => void;
  onUpdate?: (updatedUser: { email: string; username: string; image?: string }) => void;
};

const availableImages = ["image1.jpg", "image2.jpg", "image3.jpg", undefined];

export default function UpdateUserForm({ userId, onClose, onUpdate }: UpdateUserFormProps) {
  const updateUserMutation = useUpdateUser(userId);

  const { data: currentUser } = useCurrentUser();
  if (!currentUser) return <div>Loading...</div>;

  const form = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      password: "",
      confirmPassword: "",
      image: currentUser?.image || undefined,
    },
    onSubmit: async ({ value }) => {
      if (value.password && value.password !== value.confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      const body: UpdateUserInput = {
        username: value.username,
        email: value.email,
        image: value.image,
        ...(value.password ? { password: value.password } : {}),
      };

      updateUserMutation.mutate(body, {
        onSuccess: () => {
          // mettre à jour le store
          useAuthStore.getState().updateUser({
            username: value.username,
            email: value.email,
            image: value.image,
          });
          if (onUpdate) onUpdate({ username: value.username, email: value.email, image: value.image });
          if (onClose) onClose();
        },
      });
    },
  });


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-4"
    >
      {/* Image actuelle */}
      <form.Field name="image">
        {(field) => (
          <>
            <Avatar className="w-28 h-28 mx-auto mb-6 border shadow">
        <AvatarImage
          src={field.state.value ? `/images/${field.state.value}` : undefined}
          alt={`Avatar de ${currentUser.username || "l'utilisateur"}`}
        />
        <AvatarFallback className="text-4xl font-bold">
          {currentUser.username ? currentUser.username[0].toUpperCase() : "X"}
        </AvatarFallback>
      </Avatar>
      
            {/* Miniatures */}
            <div className="flex justify-center gap-3 mb-8">
              {availableImages.map((img) => (
                <Avatar
                  key={img}
                  className={`w-14 h-14 cursor-pointer border 
                    ${field.state.value === img ? "ring-1 ring-blue-100" : "opacity-70 hover:opacity-100"}`}
                  onClick={() => field.handleChange(img)}
                >
                  {img ? (
                    <AvatarImage src={`/images/${img}`} />
                  ) : (
                    <AvatarFallback className="text-lg font-bold">
                      {currentUser.username ? currentUser.username[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            </div>
          </>
        )}
      </form.Field>

      {/* Champs */}
      <form.Field name="username">
        {(field) => (
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-500 text-sm mb-1">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-500 text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Entrez votre email"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-500 text-sm mb-1">
              Mot de mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-500 text-sm mb-1">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Confirmez"
              className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
            />
          </div>
        )}
      </form.Field>

      <Button type="submit" className="w-full mt-4 cursor-pointer bg-emerald-700 text-white">
        {updateUserMutation.isPending ? "Mise à jour..." : "Enregistrer"}
      </Button>
    </form>
  );
}
  