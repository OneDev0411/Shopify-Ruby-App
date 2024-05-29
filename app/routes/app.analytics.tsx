import { useState, useCallback } from 'react';
import { Page ,Grid, Select, Banner, BlockStack } from '@shopify/polaris';
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
import CustomBanner from '~/components/CustomBanner';
import { CustomTitleBar } from '../components/customtitlebar' 
import { AlertCircleIcon } from "@shopify/polaris-icons";
import ModalChoosePlan from '../components/modal_ChoosePlan';
import {DateRangeOptions} from "~/components/shared/constants/AnalyticsOptions";
// import { onLCP, onFID, onCLS } from 'web-vitals';

export default function AnalyticsOffers() {
  const [period, setPeriod] = useState<string>('hourly');
  const [error, setError] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const setTimePeriod = useCallback((val: string) => {
    setPeriod(val)
  }, []);

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
          <CustomBanner icon={AlertCircleIcon} title="Data Failed To Load" 
                        name="dismiss_banner" 
                        content={error}
                        background_color="rgb(249,242,210)"
                        border_color="rgb(210,210,198)" 
          />
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
            <BlockStack gap={"500"}>
              <TotalSalesData period={period} onError={handleError}/>
              <AbTestingData period={period} onError={handleError}/>
            </BlockStack>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 6, lg: 4, xl: 4 }}>
            <BlockStack gap={"500"}>
              <ConversionRate period={period} onError={handleError}/>
              <ClickThroughtRateData period={period} onError={handleError} />
            </BlockStack>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 6, lg: 4, xl: 4 }}>
            <BlockStack gap={"500"}>
              <OrderOverTimeData period={period} onError={handleError}/>
              <TopPerformingOffersData period={period} onError={handleError} />
            </BlockStack>
          </Grid.Cell>
        </Grid>
      </div> 
      <div className='space-10'></div>
      <GenericFooter text="Learn more about " linkUrl="#" linkText="analytics" />
    </Page>
  );
}
