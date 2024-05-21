import {
	Card,
	BlockStack,
	Text
} from "@shopify/polaris";
import { FiveStarImage } from "~/shared/constants/Others";

interface IReviewCardProps {
	reviewHead: string;
	reviewCountry: string;
	reviewDescription: string;
}

const ReviewCard = ({ reviewHead, reviewCountry, reviewDescription }: IReviewCardProps) => {
	return (
		<Card >
			<BlockStack gap={"500"}>
				<Text variant="headingMd" as="h2">{reviewHead}</Text>
				<div>
					<p>
						<strong>{reviewCountry}</strong>
					</p>
					<p>{reviewDescription}</p>
				</div>
				<div className='space-16'></div>
			</BlockStack>
			<span className="align-center" >
				<img alt="5 stars Image" src={FiveStarImage} className="five-star-image"/>
			</span>
		</Card>
	);
}

export default ReviewCard;
