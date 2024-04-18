import { Card, EmptyState, Page } from "@shopify/polaris";

export default function NotFound() {
  return (
    <Page>
      <Card>
        <div>
          <EmptyState
            heading="There is no page at this address"
            image="https://assets.incartupsell.com/images/empty-state.svg"
          >
            <p>
              Check the URL and try again, or use the search bar to find what
              you need.
            </p>
          </EmptyState>
        </div>
      </Card>
    </Page>
  );
}
