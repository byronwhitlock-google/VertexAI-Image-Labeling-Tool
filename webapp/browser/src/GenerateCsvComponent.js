import React from "react";
import GenerateCsvButton from "./GenerateCsvButton";
import Item from "./Item.js";
import { CardContent } from "@material-ui/core";

const GenerateCsvComponent = (props) => {
  return (
    <Item>
      <CardContent>
        <GenerateCsvButton {...props} />
      </CardContent>
    </Item>
  );
};

export default GenerateCsvComponent;
