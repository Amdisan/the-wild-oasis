import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBookingsPath } from '../context/BookingsPathContext';
import BookingTable from '../features/bookings/BookingTable';
import BookingTableOperations from '../features/bookings/BookingTableOperations';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Bookings() {
  const { pathname, search } = useLocation();
  const { setPath } = useBookingsPath();

  useEffect(
    function () {
      setPath({ pathname, search });
    },
    [pathname, search]
  );

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>
      <BookingTable />
    </>
  );
}

export default Bookings;
