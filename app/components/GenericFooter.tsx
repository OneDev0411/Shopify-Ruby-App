import { Text, Icon, Link, LegacyStack } from "@shopify/polaris";
import { AlertMinor, ExternalSmallMinor } from '@shopify/polaris-icons';

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
			<LegacyStack>
          <Icon
            source={AlertMinor}
            color="base"
          />
          <Text as="p" variant="bodySm">
            {text}
            {linkText ? (
              <Link url={linkUrl} target="_blank">{linkText}.
                <Icon
                  source={ExternalSmallMinor}
                  color="base"
                />
              </Link>
            ): null}
          </Text>
      </LegacyStack>
			<div className="space-10"></div>
    </div>
		</>
	)
};
