import { useState, createContext } from "react";

export const SeatContex = createContext();

export const SeatContextProvider = ({ children }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [flights, setFlights] = useState([]);
  const [seating, setSeating] = useState([]);
  const [value, setValue] = useState();
  const [okReserved, setOkResereved] = useState();
  return (
    <SeatContex.Provider
      value={{
        selectedSeat,
        setSelectedSeat,
        flights,
        setFlights,
        seating,
        setSeating,
        value,
        setValue,
        okReserved,
        setOkResereved,
      }}
    >
      {children}
    </SeatContex.Provider>
  );
};
