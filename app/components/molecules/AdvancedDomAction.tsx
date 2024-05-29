import React from "react";
import {TextField, Select, Text, BlockStack} from "@shopify/polaris";
import { DOMActionOptions } from "../../shared/constants/DOMActionOptions";

interface IDomActionProps {
    title: string;
    actionId: string;
    selectorValue: string;
    actionValue: string;
    disabled: boolean;
    onChangeSelector: (value: string, id: string) => void;
    onChangeAction: (selected: string, id: string) => void;
};

const DomAction = ({
    title,
    actionId,
    selectorValue,
    actionValue,
    disabled,
    onChangeSelector,
    onChangeAction,
}: IDomActionProps) => (
    <div>
        <BlockStack gap={"300"}>
            <Text variant="headingSm" as="h2">{title}</Text>
            <TextField
                label="DOM Selector"
                value={selectorValue}
                onChange={onChangeSelector}
                type="text"
                disabled={disabled}
                autoComplete="off"
            />
            <Select
                label="DOM action"
                id={actionId}
                options={DOMActionOptions}
                onChange={onChangeAction}
                value={actionValue}
            />
        </BlockStack>
        <hr className="legacy-card-hr placement-hr" />
    </div>
);

export default DomAction;
