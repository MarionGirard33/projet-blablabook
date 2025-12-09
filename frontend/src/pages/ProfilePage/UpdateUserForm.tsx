// UpdateUserForm.tsx
import { useState } from "react";

type UpdateUserFormProps = {
  userId: number;
  initialData?: { email: string; username: string; image: string };
};

export default function UpdateUserForm({ userId, initialData }: UpdateUserFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    username: initialData?.username || "",
    password: "",
    image: initialData?.image || "image1.png",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: { email: string; username: string; password?: string; image: string } = { ...formData };
    if (!body.password) delete body.password;

    const res = await fetch(`http://localhost:3000/user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) alert("Profil mis à jour !");
    else alert("Erreur lors de la mise à jour.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-4">
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300" />
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password" className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300" />
      <select name="image" value={formData.image} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300">
        <option value="image1.png">Image 1</option>
        <option value="image2.png">Image 2</option>
        <option value="image3.png">Image 3</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Update User</button>
    </form>
  );
}
