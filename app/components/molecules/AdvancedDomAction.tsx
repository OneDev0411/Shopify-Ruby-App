import React from "react";
import { TextField, Select, Text } from "@shopify/polaris";
import { DOMActionOptions } from "../../shared/constants/DOMActionOptions";

interface Props {
    title: string;
    actionId: string;
    selectorValue: string;
    actionValue: string;
    disabled: boolean;
    onChangeSelector: (value: string, id: string) => void;
    onChangeAction: (selected: string, id: string) => void;
};

const DomAction: React.FC<Props> = ({
    title,
    actionId,
    selectorValue,
    actionValue,
    disabled,
    onChangeSelector,
    onChangeAction,
}) => (
    <>
        <div>
            <div style={{paddingBottom: '10px'}}>
                <Text variant="headingSm" as="h2">{title}</Text>
            </div>
            <TextField
                label="DOM Selector"
                value={selectorValue}
                onChange={onChangeSelector}
                type="text"
                disabled={disabled}
                autoComplete="off"
            />
            <div className="space-4"/>

            <Select
                label="DOM action"
                id={actionId}
                options={DOMActionOptions}
                onChange={onChangeAction}
                value={actionValue}
                disabled={disabled}
            />
        </div>
        <hr className="legacy-card-hr" />
    </>
);

export default DomAction;
