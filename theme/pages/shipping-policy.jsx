import React, { useState, useEffect } from "react";
import { useGlobalStore } from "fdk-core/utils";
import FyHTMLRenderer from "../components/core/fy-html-renderer/fy-html-renderer";
import { LEGAL_DATA } from "../queries/legalDocuments";
import { useRichText } from "../helper/hooks/hooks";

function ShippingPolicy({ fpi }) {
  const htmlContent = useGlobalStore(fpi?.getters?.LEGAL_DATA);
  const clientMarkedContent = useRichText(htmlContent?.shipping);

  return (
    <div
      className="basePageContainer margin0auto"
      style={{ padding: "20px", background: "#fff", whiteSpace: "pre-wrap" }}
    >
      {clientMarkedContent && (
        <FyHTMLRenderer htmlContent={clientMarkedContent} />
      )}
    </div>
  );
}

ShippingPolicy.serverFetch = async ({ fpi }) => {
  try {
    return fpi.executeGQL(LEGAL_DATA);
  } catch (error) {
    console.log({ error });
  }
};

export const sections = JSON.stringify([]);

export default ShippingPolicy;
