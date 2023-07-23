import { GoogleFontWrapper } from "./GoogleFontWrapper";
import { MuiWrapper } from "./MuiWrapper";

export function StorybookExampleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiWrapper>
      <GoogleFontWrapper>{children}</GoogleFontWrapper>
    </MuiWrapper>
  );
}
