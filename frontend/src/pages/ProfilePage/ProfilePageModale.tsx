import type { User } from "./interface/user.interface";
import UpdateUserForm from "./UpdateUserForm";
import { X } from "lucide-react";

type ProfileModalProps = {
  userId: number;
  userData: { email: string; username: string; image: string };
  onClose: () => void;
  onUpdate: (updatedUser: User) => void
};

export default function ProfileModal({ userId, userData, onClose, onUpdate }: ProfileModalProps) {
  return (
    <div className="fixed p-2 inset-0 bg-gray-400/50 flex justify-center items-center z-50">
    <div className="bg-white w-full p-6 rounded shadow max-w-md relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer">
        <X size={20} color="black" />
      </button>
      <h2 className="text-xl flex justify-center font-semibold my-6">Modifier mon profil</h2>
      <UpdateUserForm
        userId={userId}
        initialData={userData}
        onClose={onClose}
        onUpdate={(updatedFields) => {
          onUpdate({ id: userId, ...updatedFields });
        }}
      />
    </div>
  </div>
  );
}
