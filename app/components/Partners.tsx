import { BlockStack, Card, Image, Button, Grid, Pagination, Text } from '@shopify/polaris';
import { useState, useEffect } from 'react';
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuthenticatedFetch } from "../hooks";
import { PartnersSliderSettings } from '../shared/constants/PartnersSliderSettings';
import ErrorPage from "./ErrorPage";
import { IRootState } from '~/store/store';
import './stylesheets/settingPageStyles.css';

type Partner = {
  name: string;
  image: string;
  description: string;
  app_url: string;
}

export function Partners() {
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<Error | null>(null);

  let slider: Slider | null;

  const next = () => {
    slider?.slickNext();
  }
  const previous = () => {
    slider?.slickPrev();
  }

  const handleToggleDescription = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  useEffect(() => {
    const getAllPartners = ()=>{
      fetch(`/api/v2/merchant/partners?shop=${shopAndHost.shop}`, {
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((data) => {
          setPartners(data.partners);
        })
        .catch((error: Error) => {
          setError(error)
          console.log("error", error);
        })
    }

    getAllPartners();
  }, []);

  if (error) { return <ErrorPage />; }

  return(
    <Card>
      <BlockStack gap="300">
				<Text variant="headingMd" as="h6">Recommended Apps</Text>
				<p>Check out our partners below.</p>
				<Slider ref={c => (slider = c)} {...PartnersSliderSettings}>
					{partners && partners.map((partner, index) => (
						<Grid key={index}>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12}}>
								<div className='partner-box'>
									<Card>
										<div className='partner-image-box' >
											<Image
												alt=""
												className='partner-image'
												source={partner.image}
											/>
										</div>
										<br/>
										<h1 className='settings-card-heading'>
											<strong
												className={
													partner.name.length > 20
														? "partner-name-long"
														: "partner-name-short"
												}
											>
												{partner.name}
											</strong>
										</h1>
										<br/>
										<p
											className={index === expandedIndex ? '' : 'partner-description'}
											onClick={() => handleToggleDescription(index)}
											key={index}
										>
											{partner.description}
										</p>
										<br/>
										<BlockStack align="start">
											<Image
												className='partner-stars'
												source="https://assets.incartupsell.com/images/5-star.png"
												alt='star'
											/>
											<Button url={partner.app_url} target="_blank">View on Shopify App Store</Button>
										</BlockStack>
									</Card>
								</div>
							</Grid.Cell>
						</Grid>
					))}
				</Slider>
				<Pagination
					hasPrevious
					onPrevious={previous}
					hasNext
					onNext={next}
				/>
      </BlockStack>
    </Card>
	);
}
