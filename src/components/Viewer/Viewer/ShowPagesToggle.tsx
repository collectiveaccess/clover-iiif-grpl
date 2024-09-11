import {
  Label,
  StyledSwitch,
  StyledThumb,
  StyledToggle,
} from "src/components/Viewer/Viewer/ShowPagesToggle.styled";
import React, { useEffect, useState } from "react";
import { useViewerDispatch, useViewerState } from "src/context/viewer-context";

const Toggle = () => {
  const { configOptions } = useViewerState();
  const dispatch: any = useViewerDispatch();

  const [checked, setChecked] = useState(configOptions?.pages?.show);
  const toggleLabel = configOptions?.pages?.toggleLabel ?? "Show pages";

  useEffect(() => {
    dispatch({
      type: "updateShowPageNavigation",
      showPageNavigation: checked,
    });
  }, [checked, dispatch]);

  return (
    <StyledToggle>
      <Label htmlFor="show-pages-toggle" css={checked ? { opacity: "1" } : {}}>
        {toggleLabel}
      </Label>
      <StyledSwitch
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
        id="show-pages-toggle"
        aria-label="show pages toggle"
        name="toggled?"
      >
        <StyledThumb />
      </StyledSwitch>
    </StyledToggle>
  );
};

export default Toggle;
