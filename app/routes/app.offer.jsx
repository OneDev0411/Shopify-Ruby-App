import {
  TextField,
  IndexTable,
  Card,
  Filters,
  Select,
  useIndexResourceState,
  Page,
  Badge,
  Link,
  FooterHelp,
  Pagination,
  Grid,
  LegacyCard
} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import {useState, useCallback, useEffect} from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericFooter } from '../components';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useSelector } from "react-redux";
import { OffersList } from '../components';
import {redirect} from "@remix-run/node";

export default function IndexTableWithAllElementsExample() {

  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const info = { offer: { shop_domain: typeof document !== 'undefined' ? window.location.host : '' } };

  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState(null);
  const [offersData, setOffersData] = useState([]);
  const [sortValue, setSortValue] = useState('today');
  const [filteredData, setFilteredData] = useState([]);
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const handleOpenOfferPage = () => {
    redirect('/edit-offer/new');
  }

  return (
    <Page>
      <TitleBar
        title="Offers"
        primaryAction={{
          content: "Create Offer",
          onAction: handleOpenOfferPage,
        }}
      />
      <OffersList></OffersList>
      <div className="space-10"></div>
      <GenericFooter text='Learn more about ' linkUrl='#' linkText='offers'></GenericFooter>
    </Page>
  );
}
