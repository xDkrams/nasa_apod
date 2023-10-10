import Astronomy from "./Pages/Astronomy";
import WelcomeModal from "./Pages/WelcomeModal";
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(true);

  const toRender = () => {
    // return open ? <WelcomeModal setOpen={setOpen} /> : <Astronomy />;
    if (open) {
      return <WelcomeModal open={open} setOpen={setOpen} />;
    } else {
      return <Astronomy />;
    }
  };
  return <>{toRender()}</>;
}

export default App;
