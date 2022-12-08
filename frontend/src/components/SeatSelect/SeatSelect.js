import Plane from "./Plane";
import styled from "styled-components";
import Form from "./Form";
import { useEffect, useContext } from "react";
import { SeatContex } from "./SeatContext";

const SeatSelect = () => {
  const { flights, setFlights, value, setValue } = useContext(SeatContex);

  useEffect(() => {
    fetch("/api/get-flights")
      .then((res) => res.json())
      .then((result) => {
        setFlights(result.flights);
      });
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <SecondLogo>
        <h3 style={{ marginTop: "-14px" }}>Flight Number</h3>
        <Select value={value} onChange={handleChange}>
          <option>Choose a Flight</option>
          {flights.map((flight, index) => {
            return (
              <option key={index} value={flight}>
                {flight}
              </option>
            );
          })}
        </Select>
      </SecondLogo>
      <h2 style={{ marginTop: "10px" }}>
        Select your seat and Provide your information!
      </h2>
      <Wrapper>
        <Plane flightNumber={value} />
        <Form />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 770px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-orange);
    padding-bottom: 10px;
  }
`;

const SecondLogo = styled.div`
  display: flex;
  background: var(--color-cadmium-red);
  height: 90px;
  padding: var(--padding-page) 18px;
`;

const Select = styled.select`
  margin-left: 25px;
  margin-top: 5px;
  width: 120px;
  height: 30px;
`;

export default SeatSelect;
