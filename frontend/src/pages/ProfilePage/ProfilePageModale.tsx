import UpdateUserForm from "./UpdateUserForm";

type ProfileModalProps = {
  userId: number;
  userData: { email: string; username: string; image: string };
  onClose: () => void;
};

export default function ProfileModal({ userId, userData, onClose }: ProfileModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
    <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
      ✖️
    </button>
    <h2 className="text-xl font-semibold mb-4">Modifier mon profil</h2>
    <UpdateUserForm userId={userId} initialData={userData} />
  </div>
</div>


  );
}
