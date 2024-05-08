import { Card, AppProvider, Text, Grid } from '@shopify/polaris';
import "../components/stylesheets/editOfferStyle.css";
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import translations from "@shopify/polaris/locales/en.json";
import { useAuthenticatedFetch } from '../hooks';
import { ABTestingOptions } from '../shared/constants/Others';
import ErrorPage from "../components/ErrorPage";
import { IRootState } from '~/store/store';

interface IAbAnalyticsProps {
	offerId: number;
};

const AbAnalytics = ({ offerId }: IAbAnalyticsProps) => {
    const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
    const [aAnalytics, setAAnalytics] = useState<string>("");
    const [bAnalytics, setBAnalytics] = useState<string>("");
    const [error, setError] = useState(null);

    const fetch = useAuthenticatedFetch(shopAndHost.host);

    const getAbAnalytics = useCallback((
        offerId: number,
        shop: string,
        version: string,
        setRequiredState: React.Dispatch<React.SetStateAction<string>>
    ) => {
        fetch(`/api/v2/merchant/offers/load_ab_analytics`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ offer_id: offerId , shop: shop, version: version })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                setRequiredState(data.ctr_str)
            }
        })
        .catch((error) => {
            setError(error);
            console.log('An error occurred while making the API call:', error);
        })
    }, []); 

    useEffect(() => {
        getAbAnalytics(offerId, shopAndHost.shop, 'a', setAAnalytics)
        getAbAnalytics(offerId, shopAndHost.shop, 'b', setBAnalytics)
      },[]);

      if (error) { return < ErrorPage />; }

    return (
      <>
        <AppProvider i18n={translations}>
          <Card>
            <div className="analytics-card-style">
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="headingSm" as="h6" >
                            Options
                        </Text>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                        <Text variant="headingSm" as="h6" >
                            Click Rate
                        </Text>
                    </Grid.Cell>
                </Grid>
            </div>
            <div className='space-14'></div>
            <div className="card-space">
                {ABTestingOptions.map((option, index) => (
                    <Grid key={index}>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="bodyMd" as="p">
                                {option}
                            </Text>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="bodyMd" as="p">
                                {index === 0 ? aAnalytics : bAnalytics}
                            </Text>
                        </Grid.Cell>
                    </Grid>
                ))}
            </div>
          </Card>
        </AppProvider>
      </>
    )
}

export default AbAnalytics;
