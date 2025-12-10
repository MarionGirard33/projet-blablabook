import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import ProfilePageModal from "./ProfilePageModale";

export default function ProfilePage({ userId }: { userId: number }) {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("User not found");
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md h-[90vh] mx-auto flex flex-col justify-center p-4">

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
            src={`/images/${user.image || "image1.jpg"}`}
            alt="User avatar"
            className="w-28 h-28 rounded-full mx-auto mb-16"
          />

          {/* Infos utilisateur alignées */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4">
            <span className="font-semibold">Pseudo :</span>
            <span>{user.username}</span>

            <span className="font-semibold">Email :</span>
            <span>{user.email}</span>

            <span className="font-semibold">Mot de passe :</span>
            <span className="tracking-widest">••••••••••••</span>
          </div>
        </div>

        {/* Bouton supprimer en bas */}
        <button
          onClick={async () => {
            if (confirm("Supprimer votre compte ?")) {
              await fetch(`http://localhost:3000/user/${userId}`, { method: "DELETE" });
            }
          }}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
        >
          Supprimer mon compte
        </button>
      </div>

      {/* Modale */}
      {isModalOpen && (
        <ProfilePageModal
          userId={userId}
          userData={{ email: user.email, username: user.username, image: user.image }}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)} 
        />
      )}
    </div>
  );
}
