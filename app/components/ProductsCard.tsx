import { useState } from "react";
import {
  Card,
  VerticalStack,
  Text,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import { IRootState } from "~/store/store";

type ToastType = {
  content: string;
  error?: boolean;
}

export function EditOffer() {""}
export function ProductsCard() {
  const emptyToastProps: ToastType = { content: '' };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastProps, setToastProps] = useState<ToastType>(emptyToastProps);
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  return (
    <>
      {toastMarkup}
      <Card>
        <VerticalStack gap="5">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Text variant="headingMd" as="h4">
            TOTAL PRODUCTS
						<Text variant="headingXl" as="p">
              <Text as="span" fontWeight="semibold">
                {isLoadingCount ? "-" : data.count}
              </Text>
            </Text>
          </Text>
        </VerticalStack>
      </Card>
    </>
  );
}
