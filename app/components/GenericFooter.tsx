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
      <div style={{flex: 0.05}}>
       <Icon source={AlertCircleIcon} tone="base"/>
      </div>
      <div style={{flex: 0.3}}>
        <Text as="p" variant="bodySm">
          {text}
          {linkText ? (
            <Link url={linkUrl} target="_blank">{linkText}.
              <Icon
                source={ExternalSmallIcon}
                tone="base"
              />
            </Link>
          ): null}
        </Text>
      </div>
			<div className="space-10"></div>
    </div>
		</>
	)
};
