// Hot reloading
// import * as _unused from 'raw-loader!./index.ejs'

import React from "react";
import ReactDOM from "react-dom";
import PaperText from "./paper";
import { Provider as ScoringToggleProvider } from "./diagrams/scoring_toggle";

const Paper = (
  <React.Fragment>
    <ScoringToggleProvider>
      <PaperText></PaperText>
    </ScoringToggleProvider>
  </React.Fragment>
);

ReactDOM.render(Paper, document.querySelector("d-article-contents"));
