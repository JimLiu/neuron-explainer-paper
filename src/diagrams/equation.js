import React from "react";
import { Text } from "../components/ui";

export default ({ equation }) => {
  return (
    <span>
    {'$' + equation + '$'}
    </span>
  );
};
