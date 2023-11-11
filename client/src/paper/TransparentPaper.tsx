import { Paper, PaperProps } from "@mui/material";
import { transparentPaperSx } from "../styles";

const TransparentPaper: React.FC<PaperProps> = (props) => (
  <Paper sx={transparentPaperSx} variant="outlined" {...props} />
);

export default TransparentPaper;
