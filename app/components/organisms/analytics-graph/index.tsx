import {Card, Text} from "@shopify/polaris";
import {PolarisVizProvider, StackedAreaChart} from "@shopify/polaris-viz";
import {AnalyticsData} from "~/types/types";

interface IAnalyticsGraphCardProps {
  data: AnalyticsData[];
  count: string;
  title: string;
  loading: boolean;
  name: string;
  subTitle: string;
}

const AnalyticsGraphCard = ({
                              data,
                              count,
                              title,
                              loading,
                              name,
                              subTitle,
                            }: IAnalyticsGraphCardProps) => {
  return (
    <PolarisVizProvider
      themes={{
        Default: {
          arc: {
            cornerRadius: 5,
            thickness: 50,
          },
        },
      }}
    >
      <Card sectioned>
        <Text variant="headingMd" as="h6">{title}</Text>
        {data ? (
          <h3 className="report-money">
            <strong>{count}</strong>
          </h3>
        ) : null}
        <div className="space-4"></div>
        <p>{subTitle}</p>
        <br/>
        <div className="space-5"></div>
        {loading ? (
          "Loading..."
        ) : data.length > 0 ? (
          <StackedAreaChart
            data={[
              {
                name: name,
                data: data,
              },
            ]}
            theme="Light"
          />
        ) : null}
      </Card>
    </PolarisVizProvider>
  );
};
export default AnalyticsGraphCard;
