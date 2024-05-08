// @ts-nocheck
import {Layout, Card, Image, BlockStack, InlineGrid} from "@shopify/polaris";
import "../components/stylesheets/reviewStyle.css";

export const Reviews = () => {
    
  return (
    <div className="review-section">
      <Layout>
        <Layout.Section>
          <BlockStack distribution="center">
            <p style={{textAlign:'center'}}><strong>750+ 5 star reviews<br/>Trusted by over a thousand Shopify merchants</strong></p>
          </BlockStack>
        </Layout.Section>
      </Layout>
      <div className="space-10"></div>
      <InlineGrid gap="4" columns={{ xs: 1, sm: 1, md: 1, lg: 3, xl: 3 }}>
        <Card title="ECOKIND Cleaning" sectioned>
          <div className="card-content-wrapper">
            <div>
              <p>
                <strong>Canada</strong>
              </p>
              <p>
                Great app with good features to upsell. Been using this for a
                month and see results. We like how it's customizable. Support is
                very good too!
              </p>
              <br />
            </div>
            <BlockStack distribution="center">
              <Image source="https://assets.incartupsell.com/images/5-star.png" distribution="center" />
            </BlockStack>
          </div>
        </Card>
        <Card>
          <div className="card-content-wrapper">
            <div>
              <p>
                <strong>United States</strong>
              </p>
              <p>
                I used to use a different in cart upsell app which had a pop up.
                I like how this apps upsell does not pop up. Lasandra helped me
                set up this app and the upsell looks beautiful in my cart page.
                10/10 service, Lasandra went above & beyond!!!
              </p>
              <br />
            </div>
            <BlockStack distribution="center">
              <Image source="https://assets.incartupsell.com/images/5-star.png" distribution="center" />
            </BlockStack>
          </div>
        </Card>
        <Card>
          <div className="card-content-wrapper">
            <div>
              <p>
                <strong>Germany</strong>
              </p>
              <p>
                Very nice App with the best service! Thanks!
                <br />
                Everything works fluently and I could 3x my conversion rate.
                Very helpful.
              </p>
              <br />
            </div>
            <BlockStack distribution="center">
              <Image source="https://assets.incartupsell.com/images/5-star.png" distribution="center" />
            </BlockStack>
          </div>
        </Card>
      </InlineGrid>
    </div>
  );
}
