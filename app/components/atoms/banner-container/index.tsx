import { Banner, BannerStatus } from "@shopify/polaris";
import React from "react";

interface IBannerContainerProps {
    title: string,
    onDismiss?: () => void,
    tone: BannerStatus,
    children: React.ReactNode,
}

const BannerContainer = ({ title, onDismiss, tone, children } : IBannerContainerProps) => (
    <div style={{ marginBottom: "10px" }} className="polaris-banner-container">
       <Banner title={title} onDismiss={onDismiss} tone={tone}>
            {children}
        </Banner>
    </div>
);

export default BannerContainer;
