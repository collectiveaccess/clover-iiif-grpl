import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { AnnotationPageNormalized } from "@iiif/presentation-3";
import { getContentSearchResources } from "src/hooks/use-iiif";
import { ViewerContextStore, useViewerState } from "src/context/viewer-context";
import { AnnotationResource } from "src/types/annotations";
import { FormStyled, ButtonStyled } from "./ContentSearchForm.styled";

type Props = {
  searchServiceUrl?: string;
  setContentSearchResource: React.Dispatch<
    React.SetStateAction<AnnotationResource | undefined>
  >;
  activeCanvas: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContent: React.FC<Props> = ({
  searchServiceUrl,
  setContentSearchResource,
  setLoading,
}) => {
  const [searchTerms, setSearchTerms] = useState<string | undefined>();
  const [exactMode, setExactMode] = useState<string | undefined>("1");

  const viewerState: ViewerContextStore = useViewerState();
  const { contentSearchVault, openSeadragonViewer, configOptions } =
    viewerState;
  const searchText = configOptions.localeText?.contentSearch;

  async function searchSubmitHandler(e) {
    e.preventDefault();
    const tabLabel = searchText?.tabLabel as string;

    if (!openSeadragonViewer) return;
    if (!searchServiceUrl) return;
    if (!searchTerms || searchTerms.trim() === "") {
      // must return a label because Information Panel tab requires a label
      setContentSearchResource({
        label: { none: [tabLabel] },
      } as unknown as AnnotationPageNormalized);
      return;
    }

    setLoading(true);

    getContentSearchResources(contentSearchVault, searchServiceUrl, tabLabel, {
      q: searchTerms,
      exact: exactMode,
    }).then((resources) => {
      setContentSearchResource(resources);
      setLoading(false);
    });
  }

  const handleChange = (e: any) => {
    e.preventDefault();
    setSearchTerms(e.target.value);
  };

  const handleExact = (e: any) => {
    console.log("set exact", e.target.checked);
    setExactMode(e.target.checked ? "1" : "0");
  };

  return (
    <FormStyled>
      <Form.Root onSubmit={searchSubmitHandler} className="content-search-form">
        <Form.Field
          className="FormField"
          name="searchTerms"
          onChange={handleChange}
        >
          <Form.Control placeholder={searchText?.formPlaceholder} />
        </Form.Field>

        <Form.Submit asChild>
          <ButtonStyled type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <title>Search</title>
              <path d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" />
            </svg>
          </ButtonStyled>
        </Form.Submit>

        <Form.Field name="exactMode" onChange={handleExact}>
          <Form.Control asChild>
            <p style={{ margin: "0 0 0 10px" }}>
              <input type="checkbox" value="1" name="exactMode" /> Exact?
            </p>
          </Form.Control>
        </Form.Field>
      </Form.Root>
    </FormStyled>
  );
};

export default SearchContent;
