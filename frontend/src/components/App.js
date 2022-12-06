import styled from "styled-components";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import GlobalStyles from "./GlobalStyles";
import Edit from "./Edit";
import { useContext } from "react";
import { SeatContex } from "./SeatSelect/SeatContext";

const App = () => {
  const reservedId = localStorage.getItem("reservedId");
  const { okReserved } = useContext(SeatContex);

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect />
          </Route>
          <Route path="/confirmed">
            {okReserved ? (
              <Confirmation note={"Your flight is confirmed!"} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/view-reservation">
            {reservedId ? (
              <Confirmation note={"Your reserved flight!"} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/edit">
            {okReserved || reservedId ? <Edit /> : <Redirect to="/" />}
          </Route>
          <Route path="">404: Oops!</Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
