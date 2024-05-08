import {
    Badge,
    Button,
    Checkbox,
    Icon,
    LegacyCard,
    BlockStack,
    Modal,
    Select,
} from "@shopify/polaris";
import { XIcon  } from '@shopify/polaris-icons';
import { ModalAddConditions } from "~/components";
import { useState, useCallback, useRef, useContext } from "react";

import { condition_options } from "~/shared/constants/ConditionOptions";
import { getLabelFromValue } from "~/shared/helpers/commonHelpers";
import { QuantityArray, OrderArray } from "~/shared/constants/EditOfferOptions";

import {OfferContent, OfferContext} from "~/contexts/OfferContext";
import {IAutopilotSettingsProps, Offer} from "~/types/types";

type Rule = {
    quantity: number,
    rule_selector: string,
    item_type: string,
    item_shopify_id: number,
    item_name: string,
}

const RULE_DEFAULTS: Rule = { quantity: 0, rule_selector: 'cart_at_least', item_type: 'product', item_shopify_id: 0, item_name: "" }

interface IDisplayConditionsProps extends  IAutopilotSettingsProps{
}

const DisplayConditions = ({ autopilotCheck } : IDisplayConditionsProps) => {
    const { offer, setOffer, updateOffer } = useContext(OfferContext) as OfferContent;

    const [rule, setRule] = useState<Rule>(RULE_DEFAULTS)
    const [quantityErrorText, setQuantityErrorText] = useState<string>("");
    const [itemErrorText, setItemErrorText] = useState<string>("");

    function updateCondition() {
        if (QuantityArray.includes(rule.rule_selector)) {
            if (!rule.quantity) {
                setQuantityErrorText("Required filed");
                return;
            }
            else if (rule.quantity < 1) {
                setQuantityErrorText("Quantity can't be less than 1");
                return;
            }
        }
        if (OrderArray.includes(rule.rule_selector)) {
            if (!rule.item_name) {
                setItemErrorText("Required filed");
                return;
            }
            else {
              if (rule.item_name.length < 1) {
                              setItemErrorText("Amount can't be less than 1");
                              return;
                          }
            }
        }
        else if (!rule.item_name) {
            setItemErrorText("Required field");
            return;
        }
        // @ts-ignore
        setOffer((prev: Offer) => ({ ...prev, rules_json: [...prev.rules_json, rule] }));
        handleConditionModal();
    }

    const handleDisableCheckoutBtn = useCallback((newChecked: boolean) => updateOffer("must_accept", newChecked), []);
    const handleRemoveItiem = useCallback((newChecked: boolean) => updateOffer("remove_if_no_longer_valid", newChecked), []);
    const handleStopShowingAfterAccepted = (newChecked: boolean) => updateOffer("stop_showing_after_accepted", newChecked);

    //Modal controllers
    const [conditionModal, setConditionModal] = useState<boolean>(false);
    const handleConditionModal = useCallback(() => {
        setConditionModal(!conditionModal), [conditionModal]
        setDefaultRule();
    }, []);

    const setDefaultRule = () => {
        setRule(RULE_DEFAULTS);
        setQuantityErrorText("");
        setItemErrorText("");
    }

    function deleteRule(index: number) {
        const updatedRules = [...offer.rules_json];
        updatedRules.splice(index, 1);
        updateOffer('rules_json', updatedRules);
    }

    function updateRuleSet (value: string) {
        updateOffer('ruleset_type', value);
    }

    return (
        <>
            {(offer.id == null || offer.id != autopilotCheck?.autopilot_offer_id) && (
                <>
                    <LegacyCard title="Display Conditions" sectioned>

                        {offer?.rules_json ? (
                            <p style={{color: '#6D7175', marginTop: '-10px', marginBottom: '14px'}}>None selected (show
                                offer to all customer)</p>
                        ) : (
                            <>{Array.isArray(offer.rules_json) && offer.rules_json.map((rule, index) => (
                                <li key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                    <div style={{marginRight: '10px', display: "inline-block"}}>
                                        {getLabelFromValue(condition_options, rule.rule_selector)}: &nbsp;
                                        {/*TODO: Needs refactoring, badge only accepts string as a child*/}
                                        <Badge>
                                            "Needs Refactoring"
                                            {/*<div style={{display: 'flex', alignItems: 'center'}}>*/}
                                            {/*    {rule.quantity && */}
                                            {/*        <p style={{*/}
                                            {/*        color: 'blue',*/}
                                            {/*        marginRight: '3px'*/}
                                            {/*        }}>*/}
                                            {/*            */}
                                            {/*        {rule.quantity} &nbsp; - &nbsp;</p>}*/}
                                            {/*    <p style={{color: 'blue', marginRight: '3px'}}><b>{rule.item_name}</b>*/}
                                            {/*    </p>*/}
                                            {/*    <p style={{cursor: 'pointer'}} onClick={() => deleteRule(index)}>*/}
                                            {/*        <Icon source={XIcon} color="critical"/>*/}
                                            {/*    </p>*/}
                                            {/*</div>*/}
                                        </Badge>
                                    </div>
                                    {getLabelFromValue(rule.rule_selector)}: &nbsp; {rule.quantity} <b>{rule.item_name}</b>
                                </li>
                            ))}</>
                        )}
                        <Button onClick={handleConditionModal} >Add condition</Button>
                        <div className="space-4"/>
                        <p style={{
                            color: '#6D7175',
                            marginTop: '20px',
                            marginBottom: '23px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            Show offer when of these
                            <span style={{margin: '0 6px'}}>
                                <Select
                                    options={[
                                        {label: 'ANY', value: 'or'},
                                        {label: 'ALL', value: 'and'},
                                    ]}
                                    onChange={updateRuleSet}
                                    value={offer?.ruleset_type || 'or'}
                                    label="Rule List"
                                    labelHidden
                                />
                            </span>
                            rules are true at the same time.
                        </p>

                        <hr className="legacy-card-hr legacy-card-hr-t20-b15"/>
                        <BlockStack vertical>
                            <Checkbox
                                label="Disable checkout button until offer is accepted"
                                helpText="This is useful for products that can only be purchased in pairs."
                                checked={offer.must_accept}
                                onChange={handleDisableCheckoutBtn}
                            />
                            <Checkbox
                                label="If the offer requirements are no longer met. Remove the item from the cart."
                                checked={offer.remove_if_no_longer_valid}
                                onChange={handleRemoveItiem}
                            />
                            <Checkbox
                                label="Don't continue to show the offer after it has been accepted"
                                checked={offer.stop_showing_after_accepted}
                                onChange={handleStopShowingAfterAccepted}
                            />
                        </BlockStack>
                    </LegacyCard>
                </>
            )}
            <Modal
                open={conditionModal}
                onClose={handleConditionModal}
                title="Select products from your store"
                primaryAction={{
                    content: 'Save',
                    onAction: updateCondition,
                }}
            >
                <Modal.Section>
                    <ModalAddConditions quantityErrorText={quantityErrorText} itemErrorText={itemErrorText}
                                        condition_options={condition_options} rule={rule} setRule={setRule}/>
                </Modal.Section>
            </Modal>
        </>
    );
}

export default DisplayConditions;
