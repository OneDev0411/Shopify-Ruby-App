import { Text, Icon, Link, BlockStack } from "@shopify/polaris";
import { AlertCircleIcon, ExternalSmallIcon } from '@shopify/polaris-icons';

interface IGenericFooterProps {
	text: string;
	linkText?: string;
	linkUrl?: string;
};

export const GenericFooter = ({text, linkText, linkUrl}: IGenericFooterProps) => {
	return (
		<>
    <style>
    {
      `.Polaris-Link {
          display: inline-flex;
        }`
    }
    </style>
    <div style={{ marginTop: '60px'}}></div>
		<div style={{display: 'flex', justifyContent: 'center'}}> 
			<BlockStack>
          <Icon
            source={AlertCircleIcon}
            color="base"
          />
          <Text as="p" variant="bodySm">
            {text}
            {linkText ? (
              <Link url={linkUrl} target="_blank">{linkText}.
                <Icon
                  source={ExternalSmallIcon}
                  color="base"
                />
              </Link>
            ): null}
          </Text>
      </BlockStack>
			<div className="space-10"></div>
    </div>
		</>
	)
};
