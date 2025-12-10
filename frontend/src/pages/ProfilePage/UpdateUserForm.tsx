import { useState } from "react";

type UpdateUserFormProps = {
  userId: number;
  initialData?: { email: string; username: string; image: string };
  onClose?: () => void; 
  onUpdate?: (updatedUser: { email: string; username: string; image: string }) => void;
};

const availableImages = ["image1.jpg", "image2.jpg", "image3.jpg"];

export default function UpdateUserForm({ userId, initialData, onClose, onUpdate }: UpdateUserFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    password: "",
    confirmPassword: "",
    image: initialData?.image || "image1.png",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const body: { email: string; username: string; password?: string; image: string } = {
      username: formData.username,
      email: formData.email,
      image: formData.image,
    };

    if (formData.password) body.password = formData.password;

    const res = await fetch(`http://localhost:3000/user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Profil mis à jour !");
      const updatedUser = { username: formData.username, email: formData.email, image: formData.image };
      if (onUpdate) onUpdate(updatedUser);
      if (onClose) onClose();
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-4">

      {/* mon image actuelle */}
      <img
        src={`/images/${formData.image}`}
        alt="User avatar"
        className="w-28 h-28 rounded-full mx-auto border shadow mb-6"
      />

      {/* miniatures */}
      <div className="flex justify-center gap-3 mb-8">
        {availableImages.map(img => (
          <img
            key={img}
            src={`/images/${img}`}
            className={`w-14 h-14 rounded-full cursor-pointer border 
              ${formData.image === img ? "ring-4 ring-blue-400" : "opacity-70 hover:opacity-100"}`}
            onClick={() => setFormData({ ...formData, image: img })}
          />
        ))}
      </div>

      {/* chmaps */}     
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-500 text-sm mb-1">
          Pseudo
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Entrez votre pseudo"
          className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-500 text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Entrez votre email"
          className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-500 text-sm mb-1">
          Changer de mot de passe
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nouveau mot de passe"
          className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-500 text-sm mb-1">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirmez"
          className="w-full border rounded px-3 py-2 text-sm placeholder-gray-400"
        />
      </div>

      {/* valider */}   
      <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
        Enregistrer
      </button>
    </form>
  );
}
