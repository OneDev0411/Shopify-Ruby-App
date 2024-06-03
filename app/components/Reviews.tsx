import { Layout, BlockStack, InlineGrid, Text } from "@shopify/polaris";
import "../components/stylesheets/reviewStyle.css";
import { ReviewCard } from "./organisms";
import { CanadaReviewDescription, GermanyReviewDescription, USReviewDescription } from "~/shared/constants/Others";

export const Reviews = () => {
    
  return (
    <div className="review-section">
      <Layout>
        <Layout.Section>
          <BlockStack align="center">
            <Text alignment="center" as="strong">750+ 5 star reviews<br/>Trusted by over a thousand Shopify merchants</Text>
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
        <ReviewCard
          reviewHead="My Gaming Case"
          reviewCountry="United States"
          reviewDescription={USReviewDescription}
        />
        <ReviewCard
          reviewHead="Deinhamudi.de"
          reviewCountry="Germany"
          reviewDescription={GermanyReviewDescription}
        />
      </InlineGrid>
    </div>
  );
}
