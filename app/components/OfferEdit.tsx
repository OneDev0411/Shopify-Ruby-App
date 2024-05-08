import { useState, useCallback } from "react";
import { Card,Tabs} from "@shopify/polaris";

import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/store";

export function OfferEdit() {

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [isLoading, setIsLoading]   = useState<boolean>(true);
  const [selected, setSelected] = useState<number>(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: '/api/v1/offers',
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const tabs = [
    {
      id: '1. Products To Offer',
      content: 'Products To Offer',
      accessibilityLabel: 'Products To Offer',
      panelID: 'products-to-offer-content-1',
    },
    {
      id: '2. Look & Feels',
      content: 'Look & Feels',
      panelID: 'look-feels-content-1',
    },
    {
      id: '3. Where To Display This Offer',
      content: 'Where To Display This Offer',
      panelID: 'where.to-display-content-1',
    },
    {
      id: '4. Triggers',
      content: 'Triggers',
      panelID: 'triggers-content-1',
    },
    {
      id: '5. Advanced options',
      content: 'Advanced options',
      panelID: 'advanced-options-content-1',
    }
  ];

  return (
     <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section title={tabs[selected].content}>
          <p>Tab {selected} selected</p>
        </Card.Section>
      </Tabs>
    </Card>
  );
};
