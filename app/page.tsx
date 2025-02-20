import React from "react";
import Grid from "./components/Grid/Grid";

const styleObj: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "relative"
};

export default function Home() {
  return (
    <main style={styleObj}>
      <Grid />
    </main>
  );
}
