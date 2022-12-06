import { useState } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { SeatContex } from "./SeatContext";
import { useHistory } from "react-router-dom";

const Form = () => {
  const { selectedSeat, value, setOkResereved } = useContext(SeatContex);
  const history = useHistory();
  const initialState = {
    givenName: "",
    surname: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [givenName, setGiventName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const firstNameHandler = (e) => {
    setGiventName(e.target.value);
    setFormData({ ...formData, givenName: e.target.value });
  };
  const lastNameHandler = (e) => {
    setSurname(e.target.value);
    setFormData({ ...formData, surname: e.target.value });
  };
  const emailNameHandler = (e) => {
    setEmail(e.target.value);
    setFormData({ ...formData, email: e.target.value });
  };

  const sendingForm = () => {
    fetch("/api/add-reservation", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flight: value,
        seat: selectedSeat,
        givenName: formData.givenName,
        surname: formData.surname,
        email: formData.email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        localStorage.setItem("selectedSeat", JSON.stringify(selectedSeat));
        localStorage.setItem(
          "reservedId",
          JSON.stringify(result.data.reservedId)
        );
        setOkResereved(result.data.reservedId);
      })
      .then(() => {
        history.push("/confirmed");
      });
  };

  const splitEmail = email.split("");

  return (
    <Section>
      <Input
        placeholder="First Name"
        value={givenName}
        onChange={firstNameHandler}
        type="text"
      />
      <Input
        placeholder="Last Name"
        value={surname}
        onChange={lastNameHandler}
        type="text"
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={emailNameHandler}
        type="email"
      />

      {givenName.length > 0 &&
      surname.length > 0 &&
      email.length > 0 &&
      splitEmail.includes("@") &&
      selectedSeat !== null ? (
        <Button onClick={sendingForm}>Confirm</Button>
      ) : (
        <Button disabled>Confirm</Button>
      )}
    </Section>
  );
};

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

export default Form;
