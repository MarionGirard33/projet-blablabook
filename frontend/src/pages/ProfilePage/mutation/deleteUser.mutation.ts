import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

export const useDeleteUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.delete(`/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      alert("Compte supprimé !");
    },
    onError: (error) => {
      alert("Erreur lors de la suppression du compte");
      console.error(error);
    },
  });
};
