import {
  Card,
  InlineStack
  BlockStack,
  Tooltip,
  Text,
  Icon,
  Divider,
} from '@shopify/polaris';
import { InfoIcon } from '@shopify/polaris-icons';
import  { useEffect, useState } from 'react';
import { PolarisVizProvider, StackedAreaChart } from '@shopify/polaris-viz';
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from 'react-redux';
import '@shopify/polaris-viz/build/esm/styles.css';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import { IRootState } from '~/store/store';
import { AnalyticsGraphCard } from './organisms';
import {AnalyticsData, IAnalyticsGraphProps, ShopSalesStats} from "~/types/types";
import { DateRangeOptions, defaultResults } from '../shared/constants/AnalyticsOptions';

// @ts-ignore
const getCardTitleByPeriod = (period) => DateRangeOptions.find((item) => item.value === period).label
let formatter = Intl.NumberFormat('en', { notation: 'compact' });

const PolarisChart = ({ cardTitle, chartTitle, tooltipText, total, loading, chartData, metric }) => {
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
      <Card style={{ minHeight: 365 }}>
        <div className='icu-card-content'>
          <BlockStack gap={"200"}>
            <Text variant="headingMd" as="h4">{cardTitle}</Text>
              <CustomTooltip title={tooltipText}>
                  <span style={{ fontSize: 'small' }}>{`What's this?`}</span>
              </CustomTooltip>
              <h3 className="report-money"><strong>{total}</strong></h3>
          </BlockStack>
            <div className="space-4"></div>
            <p>{chartTitle} </p><br />
            <div className="space-5"></div>
            {loading ? (<StackedAreaChart
                isAnimated={true}
                data={[
                    {
                        "name": metric,
                        "data": defaultResults
                    },
                ]}
                legendPosition="left"
                theme='Light'
                state="loading"
            /> ) : (
                
            <StackedAreaChart
            isAnimated={true}
            data={[
                {
                    "name": metric,
                    "data": chartData
                },
            ]}
            legendPosition="left"
            theme='Light'
          />
          )}
      </div>
  </Card>
      </PolarisVizProvider>
  )
}

export function CustomTooltip({ title, children }) {
  return (
      <>
          <Tooltip content={title}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  {children}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon source={InfoIcon} tone="base" />
                  </div>
              </div>
          </Tooltip>
      </>
  );
}

export function TotalSalesData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [salesTotal, setSalesTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState(undefined);

  function getSalesData(period) {
      let redirect = Redirect.create(app);
      if (loading) return;
      setLoading(true)
      fetch(`/api/v2/merchant/shop_sale_stats`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
      })
          .then((response) => { return response.json(); })
          .then((data) => {
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setSalesTotal(data.sales_stats.sales_total)
                  console.log("Sales Total", data.sales_stats.sales_total)

                  setSalesData(data.sales_stats.results);
                  console.log("Sales Data", data.sales_stats.results)
                  setLoading(false)
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
              setLoading(false)
          });
  }

  useEffect(() => {
      getSalesData(props.period);
  }, [props.period])

  return (
      <PolarisChart
          cardTitle={`${props.title ? getCardTitleByPeriod(props.period) : ''} Total Sales`}
          chartTitle="SALES OVER TIME"
          tooltipText="All sales generated from any orders containing an upsell/cross-sell product."
          total={`$${salesTotal}`}
          loading={loading}
          chartData={salesData}
          metric="Revenue"
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
export function TotalUpSellsData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [salesTotal, setSalesTotal] = useState(0);
  const [salesData, setSalesData] = useState(defaultResults);
  const [loading, setLoading] = useState(false);
  function getSalesData(period) {
      let redirect = Redirect.create(app);
      if (loading) return;
      setLoading(true)
      fetch(`/api/v2/merchant/shop_upsell_stats`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
      })
          .then((response) => { return response.json(); })
          .then((data) => {
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setSalesTotal(data.upsells_stats.upsells_total)
                  setSalesData(data.upsells_stats.results);
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
          }).finally(() => {
              setLoading(false);
          })
  }

  useEffect(() => {
      getSalesData(props.period);
  }, [props.period])

  return (
      <PolarisChart
          cardTitle={`${props.title ? getCardTitleByPeriod(props.period) : ''} Total Upsell Revenue`}
          chartTitle="UPSELLS OVER TIME"
          tooltipText="All revenue generated from only upsell/cross-sell products."
          total={`$${salesTotal.toFixed(2)}`}
          loading={loading}
          chartData={salesData}
          metric="Revenue"
      />
  );
}

export function ConversionRate(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [addedToCart, setAddedToCart] = useState(0);
  const [reachedCheckout, setReachedCheckout] = useState(0);
  const [converted, setConverted] = useState(0);
  const [totalDisplayed, setTotalDisplayed] = useState(0);
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
              if (props.onError) {
                  props.onError(error);
              }
          })
  }

  function getOffersStatsTimesLoaded(period) {
      let redirect = Redirect.create(app);
      getOffersStats(
          `/api/v2/merchant/shop_offers_stats_times_loaded`,
          period,
          (data: OfferStatTimeLoaded) => {
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setTotalDisplayed(data.stat_times_loaded);
              }
          });
  }

  function getOffersStatsTimesConverted(period) {
      let redirect = Redirect.create(app);
      getOffersStats(
          `/api/v2/merchant/shop_offers_stats_times_converted`,
          period,
          (data: OfferStatTimeClicked) => {
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setConverted(data.stat_times_converted);
              }
          });
  }

  function getOffersStatsTimesClicked(period) {
      getOffersStats(
          `/api/v2/merchant/shop_offers_stats_times_clicked`,
          period,
          (data: OfferStatTimeCheckedout) => { setAddedToCart(data.stat_times_clicked); }
      )
  }

  function getOffersStatsTimesCheckedout(period) {
      getOffersStats(
          `/api/v2/merchant/shop_offers_stats_times_checkedout`,
          period,
          (data) => { setReachedCheckout(data.stat_times_checkedout); }
      )
  }

  useEffect(() => {
      getOffersStatsTimesLoaded(props.period);
      getOffersStatsTimesConverted(props.period);
      getOffersStatsTimesClicked(props.period);
      getOffersStatsTimesCheckedout(props.period);
  }, [props.period])

  return (
      <Card>
          <div className='icu-card-content'>
            <BlockStack gap={"300"}>
              <Text variant="headingMd" as="h4">{`${props.title ? getCardTitleByPeriod(props.period) : ''} Conversion Rate`}</Text>
              <CustomTooltip title="The percentage of users who moved to each step, compared to total views.">
                  <span style={{ fontSize: 'small' }}>{`What's this?`}</span>
              </CustomTooltip>
              <h3 className="report-money"><strong>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</strong></h3>
              </BlockStack>
              <div className="space-4"></div>
              <p>CONVERSION FUNNEL</p><br />
              <BlockStack gap={"500"}>
                  <div height="50px">
                      <span>Added to cart</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((addedToCart / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                      <div style={{ color: 'grey' }}>{addedToCart >= 0 ? addedToCart : 0} sessions</div>
                  </div>
                  <div height="50px">
                      <span>Reached checkout</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((reachedCheckout / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                      <div style={{ color: 'grey' }}>{reachedCheckout >= 0 ? reachedCheckout : 0} sessions</div>
                  </div>
                  <div height="50px">
                      <span>Sessions converted</span><span style={{ float: 'right' }}>{totalDisplayed > 0 ? ((converted / totalDisplayed) * 100).toFixed(2) : 0}%</span>
                      <div style={{ color: 'grey' }}>{converted >= 0 ? converted : 0} sessions</div>
                  </div>
              </BlockStack>
          </div>
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

export function OrderOverTimeData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersData, setOrdersData] = useState(defaultResults);
  const [loading, setLoading] = useState(false);
  function getOrdersData(period) {
      let redirect = Redirect.create(app);
      if (loading) return;
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
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
          }).finally(() => {
              setLoading(false)
          })
  }

  useEffect(() => {
      getOrdersData(props.period);
  }, [props.period])


  return (

      <PolarisChart
          cardTitle={`${props.title ? getCardTitleByPeriod(props.period) : ''} Total Orders`}
          chartTitle="ORDERS OVER TIME"
          tooltipText="All orders containing an upsell/cross-sell product."
          total={ordersTotal}
          loading={loading}
          chartData={ordersData}
          metric="Orders"
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
export function TopPerformingOffersData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [offersData, setOffersData] = useState<OfferData[]>([]);


  function getOffersData(period) {
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
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setOffersData(data.offers);
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
          })
  }

  useEffect(() => {
      getOffersData(props.period);
  }, [props.period])


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
              <div className='icu-card-content'>
                  <BlockStack gap={"300"}>
                    <Text variant="headingMd" as="h4">{`${props.title ? getCardTitleByPeriod(props.period) : ''} Top Performing Offers`}</Text>
                    <CustomTooltip title="Your highest revenue generating offers from only upsell/cross-sell products.">
                        <span style={{ fontSize: 'small' }}>{`What's this?`}</span>
                    </CustomTooltip>
                  </BlockStack>
                  <div className="space-4"></div>
                  <BlockStack align='center'>
                      {
                          (offersData || []).map((item, idx) => {
                              return (
                                  <div key={idx}>
                                      <Divider />
                                      <div style={{ padding: '16px 0' }}>
                                          <InlineStack align="space-between">
                                              <div style={{ maxWidth: '20ch' }}>
                                                  <Text truncate={true} as="p">{item.title}</Text>
                                              </div>
                                              <div style={{ maxWidth: '8ch' }}>
                                                  <Text truncate={true} as="p">$ {formatter.format(parseFloat(item.revenue.toFixed(2)))}</Text>
                                              </div>
                                          </InlineStack>
                                      </div>
                                  </div>
                              )
                          })
                      }
                      {!offersData?.length && <Text as="p">{`No Offers to display for this time period.`}</Text>}
                  </BlockStack>
              </div>
          </Card>
      </PolarisVizProvider>
  )
}

export function AbTestingData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [salesTotal, setSalesTotal] = useState(0);
  const [salesData, setSalesData] = useState(0);
  const [loading, setLoading] = useState(false);
  function getSalesData(period) {
      let redirect = Redirect.create(app);
      if (loading) return;
      setLoading(true)

      fetch(`/api/v2/merchant/shop_sale_stats`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shop: shopAndHost.shop, period: period }),
      })
          .then((response) => { return response.json(); })
          .then((data) => {
              if (data.redirect_to) {
                  redirect.dispatch(Redirect.Action.APP, data.redirect_to);
              } else {
                  setSalesTotal(data.sales_stats.sales_total)
                  setSalesData(data.sales_stats.results);
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
          }).finally(() => {
              setLoading(false)
          })
  }

  useEffect(() => {
      getSalesData(props.period);
  }, [props.period])

  return (
      <PolarisChart
          cardTitle={`${props.title ? getCardTitleByPeriod(props.period) : ''} A/B testing`}
          chartTitle="SALES OVER TIME"
          tooltipText="All sales generated from any orders containing an upsell/cross-sell product."
          total={`$${salesTotal.toFixed(2)}`}
          loading={loading}
          chartData={salesData}
          metric="Revenue"
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

export function ClickThroughtRateData(props) {
  const app = useAppBridge();
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [clicksTotal, setClicksTotal] = useState(0);
  const [clicksData, setClicksData] = useState(defaultResults);
  const [loading, setLoading] = useState(false);

  function getClicksData(period) {
      let redirect = Redirect.create(app);
      if (loading) return;
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
              }
          })
          .catch((error) => {
              if (props.onError) {
                  props.onError(error);
              }
          }).finally(() => {
              setLoading(false)
          })
  }
  useEffect(() => {
      getClicksData(props.period);
  }, [props.period])

  return (
      <PolarisChart
          cardTitle={`${props.title ? getCardTitleByPeriod(props.period) : ''} Total Clicks`}
          chartTitle="CLICKS OVER TIME"
          tooltipText="The number of users who clicked on your offers."
          total={clicksTotal}
          loading={loading}
          chartData={clicksData}
          metric="Clicks"
      />
  );
}
