import React from "react";
import { useParams } from "react-router-dom";
// import ProductListing from "@gofynd/theme-template/pages/product-listing/product-listing";
// import "@gofynd/theme-template/pages/product-listing/index.css";
import "./collection-listing-page.less";
import useCollectionListing from "./useCollectionListing";
import { getHelmet } from "../../providers/global-provider";
import ProductListing from "../../components/product-listing/product-listing";
import "../../styles/product-listing.less";

const CollectionListingPage = ({ fpi }) => {
  const params = useParams();
  const slug = params?.slug;
  const listingProps = useCollectionListing({ fpi, slug });

  // console.log("listingProps", listingProps);

  const { title, description } = listingProps;
  return (
    <>
      {getHelmet({ seo: { title, description } })}
      <div className="margin0auto basePageContainer">
        <ProductListing {...listingProps} />
      </div>
    </>
  );
};

export default CollectionListingPage;
