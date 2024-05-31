import { Layout, Card, BlockStack, InlineGrid, Text } from "@shopify/polaris";
import "../components/stylesheets/reviewStyle.css";
import { ReviewCard } from "./organisms";
import { CanadaReviewDescription, FiveStarImage, GermanyReviewDescription, USReviewDescription } from "~/shared/constants/Others";

export const Reviews = () => {
    
  return (
    <div className="review-section">
      <Layout>
        <Layout.Section>
          <BlockStack align="center">
            <p className="review-section-title">
              <strong>750+ 5 star reviews<br/>Trusted by over a thousand Shopify merchants</strong>
            </p>
          </BlockStack>
        </Layout.Section>
      </Layout>
      <div className="space-10"></div>
      <InlineGrid gap="300" columns={{ xs: 1, sm: 1, md: 1, lg: 3, xl: 3 }}>
        <ReviewCard 
          reviewHead="ECOKIND Cleaning"
          reviewCountry="Canada"
          reviewDescription={CanadaReviewDescription} 
        />
        <Card>
          <div className="card-content-wrapper">
            <Text variant="headingMd" as="h2">My Gaming Case</Text>
            <div className="gap-top">
              <p>
                <strong>United States</strong>
              </p>
              <p>{USReviewDescription}</p>
              <br />
            </div>
            <span className="align-center" >
              <img alt="5 stars Image" className="five-star-image" src={FiveStarImage}/>
            </span>
          </div>
        </Card>
        <ReviewCard
          reviewHead="Deinhamudi.de"
          reviewCountry="Germany"
          reviewDescription={GermanyReviewDescription}
        />
      </InlineGrid>
    </div>
  );
}
