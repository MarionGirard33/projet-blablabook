  import { useState } from "react";
  import { Pencil } from "lucide-react";
  import ProfilePageModal from "./ProfilePageModale";
  import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
  import type { User } from "./@types/user";
  import { Button } from "@/components/ui/button";
  import api from "@/api/axios";
  import { useDeleteUser } from "./mutation/deleteUser.mutation";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

  export default function ProfilePage({ userId }: { userId: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();
    
    const queryOptions: UseQueryOptions<User, Error> = {
      queryKey: ["user", userId],
      queryFn: async (): Promise<User> => {
        const res = await api.get<User>(`/user/${userId}`);
        return res.data;
      },
    };

    const { data: user, isLoading, isError, error } = useQuery<User, Error>(queryOptions);

    const deleteUserMutation = useDeleteUser(userId);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>{error?.message}</div>;

    return (
      <div className="flex w-full flex-col items-center justify-center py-6 md:py-0">
        {/* Carré principal */}
        <div
          className="w-full max-w-md md:max-w-lg lg:max-w-2xl border border-black rounded bg-gray-50 p-4 lg:p-4 flex flex-col justify-between
          min-h-[500px] md:min-h-[550px] lg:min-h-[600px]
          "
        >
          
          {/* Bloc supérieur : crayon + image + infos */}
          <div>
            
            {/* Crayon */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-black cursor-pointer transition"
                title="Modifier profil"
              >
                <Pencil size={20} color="black" />
              </button>
            </div>

            {/* Image */}
            <Avatar className="w-28 h-28 mx-auto mb-16 border shadow">
              <AvatarImage
                src={user?.image ? `/images/${user.image}` : undefined} // pas d'image → fallback
                alt={`Avatar de ${user?.username || "l'utilisateur"}`}
              />
              <AvatarFallback className="text-4xl font-bold">
                {user?.username ? user.username[0].toUpperCase() : "U"} {/* première lettre */}
              </AvatarFallback>
            </Avatar>
    
            {/* Infos utilisateur alignées */}
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-2 md:w-[400px] lg:w-[400px] mx-auto">

              <span className="font-semibold">Nom d'utilisateur :</span>
              <span className="break-words min-w-0">{user?.username}</span>

              <span className="font-semibold">Email :</span>
              <span className="break-words min-w-0">{user?.email}</span>

              <span className="font-semibold">Mot de passe :</span>
              <span className="tracking-widest break-words min-w-0">••••••••••••</span>
            </div>
          </div>

          {/* Bouton supprimer en bas */}
          <Button
            disabled={deleteUserMutation.isPending}
            onClick={() => deleteUserMutation.mutate()}
            variant="destructive"
            size={"delete"}
            className="mx-auto cursor-pointer"
          >
            {deleteUserMutation.isPending ? "Suppression..." : "Supprimer mon compte"}
          </Button>
        </div>

        {/* Modale */}
        {isModalOpen && user && (
          <ProfilePageModal
            userId={userId}
            onClose={() => setIsModalOpen(false)}
            onUpdate={(updatedUser) => {
            // au lieu de setUser (useEffect)
            queryClient.setQueryData(["user", userId], updatedUser);
          }}
          />
        )}
      </div>
    );
  }
