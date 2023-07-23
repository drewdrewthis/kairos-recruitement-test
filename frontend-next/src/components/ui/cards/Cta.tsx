import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import cx from "classnames";

interface CtaInterface {
  stakable?: boolean;
  isStaked?: boolean;
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}
export function Cta(props: CtaInterface) {
  const { stakable, isStaked, onClick, isActive, children = "STAKE" } = props;

  if (isStaked) {
    return <div> Staked </div>;
  }
  if (!stakable) {
    return <div> Not eligible </div>;
  }

  return (
    <Button
      onClick={onClick}
      className={cx(
        styles["remove-button"],
        "flex items-center content-center justify-center rounded p-2",
        isActive && styles.active
      )}
    >
      {children}
    </Button>
  );
}
