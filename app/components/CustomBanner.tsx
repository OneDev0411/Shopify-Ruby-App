
import { Icon, Text } from '@shopify/polaris';
import { Link } from "@remix-run/react";
import { XIcon }  from '@shopify/polaris-icons';
import { useState } from "react";

const CustomBanner = ({ icon,icon_color="", content="", link_keyword="", after_link_content="", background_color="",
                        border_color="", link_to="", name="", title="", trial_days=0 }) => {
  let contentBlock: JSX.Element | null = null;
  let dismissIconBlock: JSX.Element | null = null;
  let iconBlock: JSX.Element | null = null;
  const [open, setOpen] = useState<boolean>(true);

  const closeBanner = () => {
    setOpen(false);
    localStorage.setItem('theme_banner', 'dismissed');
  }

  if (name=="theme_app_banner") {
    contentBlock = (
      <>
        <Text as="h6" variant="headingMd">{title}</Text><br/>
        <Text as="p">
          {content}<br/><br/>
          <Link to={link_to} target="_blank">{link_keyword}</Link>{" "}
          {after_link_content}
        </Text>
      </>
    );
  }
  else if (name=="theme_app_second_banner") {
    contentBlock = (
      <>
        <Text as="h6" variant="headingMd">{title}</Text><br/>
        <Text as="p">
          {content}
          <Link to={link_to} target="_blank">{link_keyword}</Link>{" "}
          {after_link_content}
        </Text>
      </>
    );
  }
  else if (name=="limited_publish_offer") {
    contentBlock = (
      <>
        <Text as="p">
          {content}
          <Link to={link_to}>{link_keyword}</Link>
          {after_link_content}
        </Text>
      </>
    );
  }
  else if (name=="analytics_dismiss_banner") {
    contentBlock = (
      <>
        <Text as="h6" variant="headingMd">{title}</Text>
        <Text as="p">{content}</Text>
      </>
    );
  }
  else if (trial_days != 0) {
    contentBlock = (<Text as="p">{trial_days} {content}</Text>)
  }
  else {
    contentBlock = (<Text as="p">{content}</Text>)
  }

  if (name=="dismiss_banner" || name=="theme_app_second_banner" || name=="analytics_dismiss_banner") {
    dismissIconBlock = (
      <div style={{ color: "rgb(151,151,151)", float: 'right'}} onClick={closeBanner}>
        <Icon source={XIcon}/>
      </div>
    )
  }
  
  if (name != "non_icon") {
    iconBlock = (
      <div style={{ color: `${icon_color}`}}>
        <Icon source={icon}/>
      </div>  
    )
  }

  return (
    <>
      { open && 
        <div style={{ padding: "20px", 
                      borderRadius: "10px",
                      backgroundColor: `${background_color}`, 
                      border: `1px solid ${border_color}`,
                      marginBottom: "20px"
                    }}>
          {dismissIconBlock}
          <div style={{display: "flex", }}>
            {iconBlock}
            <div style={{ marginLeft: "1%"}}>
              {contentBlock}
            </div>
          </div>
        </div>
      }
    </>
  );
};
export default CustomBanner;
