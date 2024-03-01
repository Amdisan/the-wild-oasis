import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (data) => {
      console.log(data.user);
      toast.success('User account successfully updated');
      queryClient.setQueryData(['user'], () => data.user);
      // queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    isUpdating,
    updateUser,
  };
}
