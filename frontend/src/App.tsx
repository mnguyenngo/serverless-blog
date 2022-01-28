import Header from "./components/Header/Header";
import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
