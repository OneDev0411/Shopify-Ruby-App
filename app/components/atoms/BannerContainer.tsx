import { Banner } from "@shopify/polaris";
import React from "react";

type Props = {
    title: string,
    onDismiss: () => void,
    status: object,
    tone: 'success' | 'info' | 'warning' | 'critical',
    children: React.ReactNode,
}

const BannerContainer = ({ title, onDismiss, status, tone, children } : Props) => (
    <div style={{ marginBottom: "10px" }} className="polaris-banner-container">
        <Banner title={title} onDismiss={onDismiss} tone={tone}>
            {children}
        </Banner>
    </div>
);

export default BannerContainer;
