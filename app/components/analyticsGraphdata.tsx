import {
  InlineStack,
  Card,
  BlockStack,
  Text,
  Divider,
} from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import '@shopify/polaris-viz/build/esm/styles.css';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import { IRootState } from '~/store/store';
import { IAnalyticsGraphProps, AnalyticsData, ShopSalesStats } from '~/types/types';
import { AnalyticsGraphCard } from './organisms';

export function TotalSalesData({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [salesTotal, setSalesTotal] = useState<number>(0);
  const [salesData, setSalesData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  function getSalesData(period) {
    let redirect = Redirect.create(app);
    if(loading) return;
    setLoading(true)
    fetch(`/api/v2/merchant/shop_sale_stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => { return response.json(); })
      .then((data: ShopSalesStats) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setSalesTotal(data.sales_stats.sales_total)
          setSalesData(data.sales_stats.results);
        }})
      .catch((error) => {
        if (onError) {
          onError();
        }
        console.log("Error:", error)
      }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getSalesData(period);
  }, [period])

  return (
    <AnalyticsGraphCard
      data={salesData}
      count={`$${salesTotal}`}
      title={`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} Total Sales`}
      loading={loading}
      name='Revenue'
      subTitle='SALES OVER TIME'
    />
  );
}

type OfferStatTimeLoaded = {
  stat_times_loaded: number;
  orders_through_offers_count: number;
  redirect_to: string;
}

type OfferStatTimeClicked = {
  stat_times_clicked: number;
}

type OfferStatTimeCheckedout = {
  stat_times_checkedout: number;
}

export function ConversionRate({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [addedToCart, setAddedToCart] = useState<number>(0);
  const [reachedCheckout, setReachedCheckout] = useState<number>(0);
  const [converted, setConverted] = useState<number>(0);
  const [totalDisplayed, setTotalDisplayed] = useState<number>(0);
  function getOffersStats(endpointUrl, period, callback) {
    fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => { return response.json(); })
      .then((data) => {
        callback(data)
      })
      .catch((error) => {
        if (onError) {
          onError();
        }
      })
  }

  function getOffersStatsTimesLoaded(period: string) {
    let redirect = Redirect.create(app);
    getOffersStats(
      `/api/v2/merchant/shop_offers_stats_times_loaded`,
      period,
      (data: OfferStatTimeLoaded) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setTotalDisplayed(data.stat_times_loaded);
          setConverted(data.orders_through_offers_count);
        }});
  }

  function getOffersStatsTimesClicked(period: string) {
    getOffersStats(
      `/api/v2/merchant/shop_offers_stats_times_clicked`,
      period,
      (data: OfferStatTimeClicked) => { setAddedToCart(data.stat_times_clicked); }
    )
  }

  function getOffersStatsTimesCheckedout(period: string) {
    getOffersStats(
      `/api/v2/merchant/shop_offers_stats_times_checkedout`,
      period,
      (data: OfferStatTimeCheckedout) => { setReachedCheckout(data.stat_times_checkedout); }
    )
  }

  useEffect(() => {
    getOffersStatsTimesLoaded(period);
    getOffersStatsTimesClicked(period);
    getOffersStatsTimesCheckedout(period);
  }, [period])

  return (
    <Card>
      <Text variant="headingMd" as="h6">{`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} Conversion Rate`}</Text>
      <h3 className="report-money"><strong>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</strong></h3>
      <div className="space-4"></div>
      <p>CONVERSION FUNNEL</p><br />
      <BlockStack gap={"300"}>
        <div style={{height: "50px"}}>
          <span>Added to cart</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((addedToCart / totalDisplayed) * 100).toFixed(2) : 0}%</span>
          <div style={{ color: 'grey' }}>{addedToCart >= 0 ? addedToCart : 0} sessions</div>
        </div>
        <div style={{height: "50px"}}>
          <span>Reached Checkout</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((reachedCheckout / totalDisplayed) * 100).toFixed(2) : 0}%</span>
          <div style={{ color: 'grey' }}>{reachedCheckout >= 0 ? reachedCheckout : 0} sessions</div>
        </div>
        <div style={{height: "50px"}}>
          <span>Sessions converted</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</span>
          <div style={{ color: 'grey' }}>{converted >= 0 ? converted : 0} sessions</div>
        </div>
      </BlockStack>
    </Card>
  );
}

type ShopOrdersStats = {
  orders_stats: {
    results: AnalyticsData[];
    orders_total: number;
  }
  redirect_to: string;
}

export function OrderOverTimeData({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [ordersTotal, setOrdersTotal] = useState<number>(0);
  const [ordersData, setOrdersData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  function getOrdersData(period: string) {
    let redirect = Redirect.create(app);
    if(loading) return;
    setLoading(true)
    fetch(`/api/v2/merchant/shop_orders_stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => { return response.json(); })
      .then((data: ShopOrdersStats) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setOrdersTotal(data.orders_stats.orders_total)
          setOrdersData(data.orders_stats.results)
        }})
      .catch((error) => {
        if (onError) {
          onError();
        }
      }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getOrdersData(period);
  }, [period])


  return (
    <AnalyticsGraphCard
      data={ordersData}
      count={`${ordersTotal}`}
      title={`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} Total Orders`}
      loading={loading}
      name='Orders'
      subTitle='ORDERS OVER TIME'
    />
  );

}

type OffersList = {
  shopify_domain: string;
  offers: OfferData[];
}

type OfferData = {
  id: number;
  title: string;
  status: boolean;
  clicks: number;
  views: number;
  revenue: number;
  created_at: string;
}

export function TopPerformingOffersData({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [offersData, setOffersData] = useState<OfferData[]>([]);

  function getOffersData(period: string) {
    let redirect = Redirect.create(app);
    fetch(`/api/v2/merchant/offers_list_by_period`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data: OffersList) => {
        if (data.shopify_domain) {
          redirect.dispatch(Redirect.Action.APP, data.shopify_domain);
        } else {
          setOffersData(data.offers);
        }})
      .catch((error) => {
        if (onError) {
          onError();
        }
      })
  }

  useEffect(() => {
    getOffersData(period);
  }, [period])


  return (
    <PolarisVizProvider
      themes={{
        Default: {
          arc: {
            cornerRadius: 5,
            thickness: 50
          }
        }
      }}
    >
      <Card>
        <Text variant="headingMd" as="h6">{`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} Top performing offers`}</Text>
        <div className="space-4"></div>
        <BlockStack align='center'>
          {
            offersData.map((item, idx) => {
              return (
                <div key={idx}>
                  <Divider />
                  <div style={{ padding: '16px 0' }}>
                    <InlineStack align="space-between">
                      <Text as="p">{item.
                        title}</Text>
                      <Text as="p">{item.
                        clicks} clicks</Text>
                      <Text as="p">$ {item.
                        revenue}</Text>
                    </InlineStack>
                  </div>
                </div>
              )
            })
          }
        </BlockStack>
      </Card>
    </PolarisVizProvider>
  )
}

export function AbTestingData({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [salesTotal, setSalesTotal] = useState<number>(0);
  const [salesData, setSalesData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  function getSalesData(period: string) {
    let redirect = Redirect.create(app);
    if(loading) return;
    setLoading(true)

    fetch(`/api/v2/merchant/shop_sale_stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => { return response.json(); })
      .then((data: ShopSalesStats) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setSalesTotal(data.sales_stats.sales_total)
          setSalesData(data.sales_stats.results);
        }})
      .catch((error) => {
        if (onError) {
          onError();
        }
      }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getSalesData(period);
  }, [period])


  return (
    <AnalyticsGraphCard
      data={salesData}
      count={`$${salesTotal}`}
      title={`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} A/B testing`}
      loading={loading}
      name='Revenue'
      subTitle='SALES OVER TIME'
    />
  );

}

type ShopClicksStats = {
  clicks_stats: {
    results: AnalyticsData[];
    clicks_total: number;
  },
  redirect_to: string;
}

export function ClickThroughtRateData({title, period, onError}: IAnalyticsGraphProps) {
  const app = useAppBridge();

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [clicksTotal, setClicksTotal] = useState<number>(0);
  const [clicksData, setClicksData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function getClicksData(period: string) {
    let redirect = Redirect.create(app);
    if(loading) return;
    setLoading(true)
    fetch(`/api/v2/merchant/shop_clicks_stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
    })
      .then((response) => { return response.json(); })
      .then((data: ShopClicksStats) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
        } else {
          setClicksTotal(data.clicks_stats.clicks_total)
          setClicksData(data.clicks_stats.results)
        }})
      .catch((error) => {
        if (onError) {
          onError();
        }
      }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    getClicksData(period);
  }, [period])

  return (
    <AnalyticsGraphCard
      data={clicksData}
      count={`${clicksTotal}`}
      title={`${title ? `${period[0].toUpperCase()}${period.substring(1)} ` : ''} Click through rate`}
      loading={loading}
      name='Clicks through rate'
      subTitle='Clicks through rate over time'
    />
  );
}
