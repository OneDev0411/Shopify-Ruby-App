// @ts-nocheck
import {useCallback, useEffect, useState} from 'react';
import { useNavigate } from "@remix-run/react";
import { Modal } from '@shopify/polaris';
import {useShopState} from "~/contexts/ShopContext";
import {useAuthenticatedFetch} from "~/hooks";
import {useSelector} from "react-redux";
import {useEnv} from "../contexts/EnvContext";

const ModalChoosePlan = () => {
  const env = useEnv();
  const navigateTo = useNavigate();
  const shopAndHost = useSelector((state) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const { isSubscriptionUnpaid, setIsSubscriptionUnpaid } = useShopState();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const modalContent = document.getElementById('not-dismissable-modal');

    if (modalContent) {
      let modal = modalContent.closest('.Polaris-Modal-Dialog__Modal');

      if (modal) {
        let closeButton: HTMLButtonElement | null = modal.querySelector('.Polaris-Modal-CloseButton')
        if (closeButton) {
          closeButton.style.display = 'none';

        }
      }
    }

    if(isSubscriptionUnpaid === null) {
      fetch('api/v2/merchant/is_subscription_unpaid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shop: shopAndHost.shop })
      }).then(response => response.json()).then((response) => {
        if (setIsSubscriptionUnpaid) {
          setIsSubscriptionUnpaid(response.subscription_not_paid)
        } });
    }

  }, [])

  const handleChoosePlan = useCallback(() => {
    navigateTo('/app/subscription');
  }, [navigateTo]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
  <Modal
      open={isSubscriptionUnpaid && modalOpen}
      onClose={handleModalClose}
      title="Choose Plan"
      primaryAction={{
        content: 'Choose Plan',
        onAction: handleChoosePlan,
      }}
    >
      <Modal.Section>
        <div id="not-dismissable-modal">
          <p>{ env?.CHOOSE_PLAN_MODAL_CONTENT }</p>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default ModalChoosePlan;
