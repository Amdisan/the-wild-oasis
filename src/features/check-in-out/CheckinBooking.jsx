import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import { useCheckin } from './useCheckin';
import { useSettings } from '../settings/useSettings';
import { useBookingsPath } from '../../context/BookingsPathContext';
import BookingDataBox from '../../features/bookings/BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';
import Checkbox from '../../ui/Checkbox';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { booking = {}, isLoading } = useBooking();
  const { isLoading: isLoadingSettings, settings = {} } = useSettings();
  const { path } = useBookingsPath();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkin, isCheckingIn } = useCheckin();

  function navigateBookings() {
    if (!path?.search && path?.pathname) {
      navigate(path?.pathname);
    }
    if (path?.search && path?.pathname) {
      navigate(`${path.pathname}${path.search}`);
    }
    if (!path?.search && !path?.pathname) {
      navigate('/');
    }
  }

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking.isPaid]);

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin(
        {
          bookingId,
          breakfast: {
            hasBreakfast: true,
            extrasPrice: optionalBreakfastPrice,
            totalPrice: totalPrice + optionalBreakfastPrice,
          },
        },
        {
          onSettled: navigateBookings,
        }
      );
    } else {
      checkin(
        { bookingId, breakfast: {} },
        {
          onSettled: navigateBookings,
        }
      );
    }
  }

  if (isLoading || isLoadingSettings) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((addBreakfast) => !addBreakfast);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}
      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirmPaid) => !confirmPaid)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.fullName} has paid the total amount of{' '}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
