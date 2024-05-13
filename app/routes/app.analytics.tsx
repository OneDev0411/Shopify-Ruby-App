import { useState, useCallback } from 'react';
import { Page ,Grid, Select, Banner } from '@shopify/polaris';
import { GenericFooter } from '../components/GenericFooter';
import "../components/stylesheets/mainstyle.css";
import {
  TotalSalesData,
  ConversionRate,
  TopPerformingOffersData,
  OrderOverTimeData,
  AbTestingData,
  ClickThroughtRateData
} from "../components/analyticsGraphdata";

import { CustomTitleBar } from '../components/customtitlebar'

import ModalChoosePlan from '../components/modal_ChoosePlan';
import {DateRangeOptions} from "~/components/shared/constants/AnalyticsOptions";
// import { onLCP, onFID, onCLS } from 'web-vitals';

export default function AnalyticsOffers() {
  const [period, setPeriod] = useState<string>('daily');
  const [error, setError] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const setTimePeriod = useCallback((val: string) => {
    setPeriod(val)
  }, []);

  const handleDismiss = () => {
    setError(null);
    setShowBanner(false);
  };

  const handleError = () => {
    setError('Some of your analytics data failed to load, so your stats may not be complete.');
    setShowBanner(true);
  };


  // useEffect(()=> {
  //   onLCP(traceStat, {reportSoftNavs: true});
  //   onFID(traceStat, {reportSoftNavs: true});
  //   onCLS(traceStat, {reportSoftNavs: true});
  // }, []);

  return (
    <Page>
      <ModalChoosePlan />
        <CustomTitleBar title='Analytics' />
        { error && showBanner && (
          <Banner title="Data Failed To Load" onDismiss={(handleDismiss)}>
            <p> {error} </p>
          </Banner>
        )}
      <div className="space-10"></div>
      <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
          <Select
            label="Date range"
            options={DateRangeOptions}
            onChange={setTimePeriod}
            value={period}
          />
        </Grid.Cell>
      </Grid>
      <div className="space-10"></div>
      <div id={"graphs"}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 6, lg: 4, xl: 4 }}>
            <TotalSalesData period={period} onError={handleError}/>
            <AbTestingData period={period} onError={handleError}/>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 6, lg: 4, xl: 4 }}>
            <ConversionRate period={period} onError={handleError}/>
            <ClickThroughtRateData period={period} onError={handleError} />
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 6, lg: 4, xl: 4 }}>
            <OrderOverTimeData period={period} onError={handleError}/>
            <TopPerformingOffersData period={period} onError={handleError} />
          </Grid.Cell>
        </Grid>
      </div>
      <div className='space-10'></div>
      <GenericFooter text="Learn more about " linkUrl="#" linkText="analytics" />
    </Page>
  );
}
