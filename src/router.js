import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/home">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
