import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { SeatContex } from "./SeatSelect/SeatContext";
import tombstone from "../assets/tombstone.png";

const Confirmation = ({ note }) => {
  const { okReserved } = useContext(SeatContex);
  const [reservedSeat, setReservedSeat] = useState([]);

  const reservedId = JSON.parse(localStorage.getItem("reservedId"));

  const history = useHistory();

  useEffect(() => {
    if (okReserved) {
      fetch(
        `https://myslingairapp.herokuapp.com/api/getSingleReserve/${okReserved}`
      )
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          if (result) {
            setReservedSeat(result.data);
          }
        });
    } else {
      fetch(
        `https://myslingairapp.herokuapp.com/api/getSingleReserve/${reservedId}`
      )
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          if (result) {
            setReservedSeat(result.data);
          }
        });
    }

    // eslint-disable-next-line
  }, []);

  const editForm = () => {
    history.push("/edit");
  };

  return (
    <Section>
      <Wrapper>
        <Content>
          <Header>{note}</Header>
          <Details>Reservation #:{reservedSeat._id}</Details>
          <Details>Flight #: {reservedSeat.flight}</Details>
          <Details>Seat #: {reservedSeat.seat}</Details>
          <Details>
            Name #: {reservedSeat.givenName} {reservedSeat.surname}
          </Details>
          <Details>Email #: {reservedSeat.email}</Details>
        </Content>
        <Button onClick={editForm}>Edit</Button>
        <Button
          onClick={() => {
            history.push("/");
          }}
        >
          Home page
        </Button>
        <Image src={tombstone} />;
      </Wrapper>
    </Section>
  );
};

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 360px;
  border: 2px solid var(--color-alabama-crimson);
  margin-top: 150px;
  padding: 20px 15px;
`;

const Header = styled.p`
  font-family: var(--font-body);
  color: var(--color-alabama-crimson);
  font-size: 20px;
  text-align: center;
  border-bottom: 2px solid var(--color-alabama-crimson);
  padding-bottom: 10px;
`;

const Details = styled.p`
  font-family: var(--font-body);
  margin-top: 10px;
  font-weight: bold;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  margin-top: 70px;
`;

const Button = styled.button`
  background-color: var(--color-cadmium-red);
  font-size: 27px;
  margin-top: 15px;
  border: none;
  border-radius: 5px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Confirmation;
