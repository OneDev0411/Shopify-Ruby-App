import { Spinner } from "@shopify/polaris";

const LoadingSpinner = () => (
    <div
        style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
        }}
    >
        <Spinner accessibilityLabel="Loading data" size="large" />
    </div>
);

export default LoadingSpinner;
