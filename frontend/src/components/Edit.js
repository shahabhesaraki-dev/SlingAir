import styled from "styled-components";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Edit = () => {
  const history = useHistory();

  const selectedSeat = localStorage.getItem("selectedSeat");
  const reservedId = JSON.parse(localStorage.getItem("reservedId"));

  const [reservedSeat, setReservedSeat] = useState([]);
  const [givenName, setGiventName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    fetch(
      `https://myslingairapp.herokuapp.com/api/getSingleReserve/${reservedId}`
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result) {
          setReservedSeat(result.data);
          setGiventName(result.data.givenName);
          setSurname(result.data.surname);
          setEmail(result.data.email);
        }
      });
    // eslint-disable-next-line
  }, [reservedId]);

  const firstNameHandler = (e) => {
    setGiventName(e.target.value);
    setReservedSeat({ ...reservedSeat, givenName: e.target.value });
  };
  const lastNameHandler = (e) => {
    setSurname(e.target.value);
    setReservedSeat({ ...reservedSeat, surname: e.target.value });
  };
  const emailNameHandler = (e) => {
    setEmail(e.target.value);
    setReservedSeat({ ...reservedSeat, email: e.target.value });
  };

  const editForm = () => {
    fetch("https://myslingairapp.herokuapp.com/api/update-reservation", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flight: reservedSeat.flight,
        seat: reservedSeat.seat,
        givenName: reservedSeat.givenName,
        surname: reservedSeat.surname,
        email: reservedSeat.email,
      }),
    }).then(() => {
      history.push("/view-reservation");
    });
  };

  return (
    <Wrapper>
      {reservedSeat && givenName && surname && email ? (
        <Section>
          <Input
            placeholder="First Name"
            value={givenName || ""}
            onChange={firstNameHandler}
            type="text"
          />
          <Input
            placeholder="Last Name"
            value={surname || ""}
            onChange={lastNameHandler}
            type="text"
          />
          <Input
            placeholder="Email"
            value={email || ""}
            onChange={emailNameHandler}
            type="email"
          />
          {givenName.length > 0 &&
          surname.length > 0 &&
          email.length > 0 &&
          email.split("").includes("@") &&
          selectedSeat !== null ? (
            <Button onClick={editForm}>Edit</Button>
          ) : (
            <Button disabled>Edit</Button>
          )}
        </Section>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 140px;
  border: 2px solid var(--color-cadmium-red);
  width: 300px;
  height: 250px;
  padding: 20px 30px;
`;

const Input = styled.input`
  font-size: 17px;
`;

const Button = styled.button`
  background-color: var(--color-cadmium-red);
  font-size: 27px;
  margin-top: 2px;
  border: none;
  border-radius: 5px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Edit;
