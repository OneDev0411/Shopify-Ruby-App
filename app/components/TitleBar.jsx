import {Button, Text, Icon, Grid } from "@shopify/polaris";

export function TitleBar ({title, image, buttonText, handleButtonClick}) {
	return (
		<>
      <div style={{borderBottom: '1px solid #E1E3E5'}}>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 10, xl: 6}}>
            <div style={{display: 'flex', float: 'left', gap: '10px', alignItems: 'center', height: '36px'}}>
              <img src={image} />
              <Text variant="headingLg" as="h1" fontWeight="medium">
                {title}
              </Text>
            </div>
          </Grid.Cell>
          {buttonText ? (
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 2, xl: 6}}>
              <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button primary onClick={handleButtonClick}>{buttonText}</Button>
              </div>
          </Grid.Cell>
          ): null}
        </Grid>
        <div className="space-4"></div>
      </div>
      <div className="space-4"></div>
		</>
	)
};
