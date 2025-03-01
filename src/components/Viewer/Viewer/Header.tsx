import {
  Header,
  HeaderOptions,
  IIIFBadgeButton,
  ManifestLabel,
  PopoverContent,
} from "./Header.styled";
import {
  ViewerContextStore,
  useViewerDispatch,
  useViewerState,
} from "src/context/viewer-context";

import Collection from "src/components/Viewer/Collection/Collection";
import CopyText from "src/components/Viewer/CopyText";
import IIIFBadge from "src/components/Viewer/Viewer/IIIFBadge";
import { InternationalString, ManifestNormalized } from "@iiif/presentation-3";
import { Label } from "src/components/Primitives";
import { Popover } from "src/components/UI";
import React, { useEffect, useState } from "react";
import Toggle from "./Toggle";
import ShowPagesToggle from "./ShowPagesToggle";
import ViewerDownload from "./Download";
import { media } from "src/styles/stitches.config";
import { useMediaQuery } from "src/hooks/useMediaQuery";

interface Props {
  manifest: ManifestNormalized;
  manifestId: string;
  manifestLabel: InternationalString;
}

const ViewerHeader: React.FC<Props> = ({
  manifest,
  manifestId,
  manifestLabel,
}) => {
  const viewerState: ViewerContextStore = useViewerState();
  const { collection, configOptions } = viewerState;
  const dispatch: any = useViewerDispatch();

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    setActiveIndex(0);
  }, []);

  const {
    informationPanel,
    showDownload,
    showIIIFBadge,
    showTitle,
    headerNavigation,
  } = configOptions;

  /**
   * Determine if header options should be rendered.
   */
  const hasOptions =
    showDownload || showIIIFBadge || informationPanel?.renderToggle;
  const isSmallViewport = useMediaQuery(media.sm);

  return (
    <Header className="clover-viewer-header">
      {collection?.items ? (
        <Collection />
      ) : (
        <ManifestLabel className={!showTitle ? "visually-hidden" : ""}>
          {showTitle && <Label label={manifestLabel} className="label" />}
          {headerNavigation && (
            <span
              className="headerNavigation"
              dangerouslySetInnerHTML={{ __html: headerNavigation }}
            ></span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              if (!manifest.items[activeIndex - 1]) {
                return;
              }
              const prevId = manifest.items[activeIndex - 1].id;
              setActiveIndex(activeIndex - 1);
              dispatch({
                type: "updateActiveCanvas",
                canvasId: prevId,
              });
            }}
          >
            Previous page
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!manifest.items[activeIndex + 1]) {
                return;
              }
              const nextId = manifest.items[activeIndex + 1].id;
              setActiveIndex(activeIndex + 1);
              dispatch({
                type: "updateActiveCanvas",
                canvasId: nextId,
              });
            }}
          >
            Next page
          </button>
        </ManifestLabel>
      )}
      {hasOptions && (
        <HeaderOptions>
          {showDownload && <ViewerDownload />}
          {showIIIFBadge && (
            <Popover>
              <IIIFBadgeButton>
                <IIIFBadge />
              </IIIFBadgeButton>
              <PopoverContent>
                {collection?.items && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(collection.id, "_blank");
                    }}
                  >
                    View Collection
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(manifestId, "_blank");
                  }}
                >
                  View Manifest
                </button>{" "}
                {collection?.items && (
                  <CopyText
                    textPrompt="Copy Collection URL"
                    textToCopy={collection.id}
                  />
                )}
                <CopyText
                  textPrompt="Copy Manifest URL"
                  textToCopy={manifestId}
                />
              </PopoverContent>
            </Popover>
          )}
          {informationPanel?.renderToggle && !isSmallViewport && <Toggle />}
          <ShowPagesToggle />
        </HeaderOptions>
      )}
    </Header>
  );
};

export default ViewerHeader;
