import {Page, Layout, Card, BlockStack as Stack, Image, BlockStack} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {Redirect, Toast} from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react'
import {woohoo} from "@assets";
import "../components/stylesheets/mainstyle.css";
import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from "~/store/store";

export default function ConfirmCharge() {
    const urlParams = new URLSearchParams(typeof document !== 'undefined' ? window.location.search : '');
    const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
    const app = useAppBridge();
    const success = JSON.parse(urlParams.get('success') || '');
    const redirectToHome = ()=>{
      let redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, `/?shop=${shopAndHost.shop}&host=${shopAndHost.host}`);
    }

  return (
    <Page>
        <TitleBar title="Confirm Charge"></TitleBar>
        <div className="auto-height">
          <Layout>
            {success ? (
              <Layout.Section>
                <Card>
                  <BlockStack align="center">
                    <Image
                        source={woohoo}
                        alt="woohoo"
                    />
                    </BlockStack>
                    <BlockStack align="center">
                      <div>
                        The subscription was successful
                      </div>
                    </BlockStack>
                    <Stack align="center">
                    <a href="#" onClick={redirectToHome}>Please click here</a>
                    </Stack>
                  </Card>
                </Layout.Section>
              ) : (
              <Layout.Section>
                <Card>
                  <BlockStack align="center">
                    <div>
                      Ooops! Something went wrong
                    </div>
                  </BlockStack>
                  <BlockStack align="center">
                    <a href="#" onClick={redirectToHome}>Please contact our staff</a>
                  </BlockStack>
                </Card>
              </Layout.Section>
              )}
          </Layout>
        </div>
        <div className="space-10"></div>
    </Page>
  );
}
