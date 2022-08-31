import React from "react";
import { CircularProgress } from "@material-ui/core";
export default function CircularLoading({ colors, size, position }) {
  return (
    <CircularProgress
      style={{ color: colors ?? "white", position: position && "absolute" }}
      size={size ? "32px" : "20px"}
    ></CircularProgress>
  );
}
