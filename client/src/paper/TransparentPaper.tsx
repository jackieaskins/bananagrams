import { Paper, PaperProps } from "@mui/material";
import { transparentPaperSx } from "../styles";

export default function TransparentPaper(props: PaperProps): JSX.Element {
  return <Paper sx={transparentPaperSx} variant="outlined" {...props} />;
}
