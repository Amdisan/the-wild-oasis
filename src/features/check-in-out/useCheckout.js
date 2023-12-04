import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),
    //data is the same as returned data from mutationFn, don't forget to return updateBooking() or data will be undefined
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true }); //invalidates all queries active on the page
    },

    onError: () => {
      toast.error('There was an error while checking out');
    },
  });

  return { checkout, isCheckingOut };
}
