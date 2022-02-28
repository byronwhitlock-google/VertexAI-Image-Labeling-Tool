import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

export default function Loader({progress}) {
 
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress variant="determinate" value={progress} />
    </Box>
  );
}
