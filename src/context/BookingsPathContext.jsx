import { createContext, useContext, useState } from 'react';

const BookingsPathContext = createContext();

function BookingsPathProvider({ children }) {
  const [path, setPath] = useState();

  return (
    <BookingsPathContext.Provider value={{ path, setPath }}>
      {children}
    </BookingsPathContext.Provider>
  );
}

function useBookingsPath() {
  const context = useContext(BookingsPathContext);
  if (context === undefined)
    throw new Error(
      'BookingsPathContext was used outside of BookingsPathProvider'
    );
  return context;
}

export { BookingsPathProvider, useBookingsPath };
