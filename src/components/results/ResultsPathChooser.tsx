"use client";

import { useState } from "react";
import { SecondaryPaths } from "./SecondaryPaths";
import { ResultsCTA } from "./ResultsCTA";

interface ChosenPath {
  slug: string;
  name: string;
}

interface AlternativePath {
  pathSlug: string;
  pathName: string;
  altDescription: string | null;
  altWhyConsider: string | null;
  altTradeoff: string | null;
  altRevenueRange: string | null;
}

interface ResultsPathChooserProps {
  primaryPath: ChosenPath;
  secondaryPaths: AlternativePath[];
  founderVideoSlot?: React.ReactNode;
}

export function ResultsPathChooser({
  primaryPath,
  secondaryPaths,
  founderVideoSlot,
}: ResultsPathChooserProps) {
  const [confirmedPath, setConfirmedPath] = useState<ChosenPath | null>(null);

  const handleChooseAlt = (slug: string, name: string) => {
    setConfirmedPath({ slug, name });
  };

  const handleSwitchBack = () => {
    setConfirmedPath(null);
  };

  return (
    <>
      <SecondaryPaths paths={secondaryPaths} onChoosePath={handleChooseAlt} />
      {founderVideoSlot}
      <ResultsCTA primaryPath={primaryPath} confirmedPath={confirmedPath} onSwitchBack={handleSwitchBack} />
    </>
  );
}
