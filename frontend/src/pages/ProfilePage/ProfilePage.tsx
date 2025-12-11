  import { useState } from "react";
  import { Pencil } from "lucide-react";
  import ProfilePageModal from "./ProfilePageModale";
  import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
  import type { User } from "./interface/user.interface";
  import { Button } from "@/components/ui/button";
  import api from "@/api/axios";

  
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>{error?.message}</div>;

    return (
      <div className="w-full max-w-md h-[70vh] mx-auto flex flex-col justify-center p-4">

        {/* Carré principal */}
        <div className="w-full border border-black rounded-lg bg-gray-50 p-6 flex flex-col justify-between h-[85%] mt-4">
          
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
            <img
              src={`/images/${user?.image || "image1.jpg"}`}
              alt="User avatar"
              className="w-28 h-28 rounded-full mx-auto mb-16"
            />

            {/* Infos utilisateur alignées */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4">
              <span className="font-semibold">Pseudo :</span>
              <span>{user?.username}</span>

              <span className="font-semibold">Email :</span>
              <span>{user?.email}</span>

              <span className="font-semibold">Mot de passe :</span>
              <span className="tracking-widest">••••••••••••</span>
            </div>
          </div>

          {/* Bouton supprimer en bas */}
          <Button variant="destructive" 
            className="cursor-pointer"
            onClick={async () => {
              //TODO créer une modale
              if (confirm("Supprimer votre compte ?")) {
                await api.delete(`/user/${userId}`);
              }
            }}
          >
            Supprimer mon compte
          </Button>
        </div>

        {/* Modale */}
        {isModalOpen && user && (
          <ProfilePageModal
            userId={userId}
            userData={{ email: user.email, username: user.username, image: user.image }}
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
