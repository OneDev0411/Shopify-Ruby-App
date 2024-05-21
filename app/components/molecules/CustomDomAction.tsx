import { TextField, Select } from "@shopify/polaris";
import { DOMActionOptions } from "../../shared/constants/DOMActionOptions";

interface ICustomDomActionProps {
  selectorId: string;
  actionId: string;
  selectorValue: string;
  actionValue: string;
  onChangeSelector: (value: string, id: string) => void;
  onChangeAction: (selected: string, id: string) => void;
}

const CustomDomAction = ({
  selectorId,
  actionId,
  selectorValue,
  actionValue,
  onChangeSelector,
  onChangeAction,
}: ICustomDomActionProps) => (
  <>
    <TextField
      id={selectorId}
      label="DOM Selector"
      value={selectorValue}
      onChange={onChangeSelector}
      type="text"
      autoComplete="off"
    />
    <Select
      label="DOM action"
      id={actionId}
      options={DOMActionOptions}
      onChange={onChangeAction}
      value={actionValue}
    />
  </>
);

export default CustomDomAction;
