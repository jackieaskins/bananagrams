import { Tooltip } from "@mui/material";
import Button from "../buttons/Button";

type PeelButtonProps = {
  canPeel: boolean;
  handlePeel: () => void;
  peelWinsGame: boolean;
};

const PeelButton: React.FC<PeelButtonProps> = ({
  canPeel,
  handlePeel,
  peelWinsGame,
}) => {
  const getPeelButtonHint = (): string => {
    if (!canPeel) {
      return "You must have a valid connected board to peel";
    }

    if (peelWinsGame) {
      return "Win the game!";
    }

    return "Get a new tile and send one to everyone else";
  };

  return (
    <Tooltip title={getPeelButtonHint()}>
      <span>
        <Button size="large" fullWidth onClick={handlePeel} disabled={!canPeel}>
          {peelWinsGame ? "Bananas!" : "Peel!"}
        </Button>
      </span>
    </Tooltip>
  );
};

export default PeelButton;
