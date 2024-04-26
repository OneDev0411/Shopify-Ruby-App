import { Select, TextField, LegacyStack } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SearchProductsList } from './SearchProductsList';
import { countriesList } from "~/components/countries";
import { useAuthenticatedFetch } from "~/hooks";
import { CartItemOptions } from '~/shared/constants/Others';
import ErrorPage from "../components/ErrorPage";
import {IRootState} from "~/store/store";
import { Product } from '~/types/types';

interface IModalAddConditionsProps {
  rule: any,
  setRule: (thing: any) => void,
  itemErrorText: string,
  quantityErrorText: string
  condition_options: string[],
}

export function ModalAddConditions({ rule, setRule, itemErrorText, quantityErrorText, condition_options }: IModalAddConditionsProps) {
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [queryValue, setQueryValue] = useState<string>("");
  const [productData, setProductData] = useState<Product[]>([]);
  const [item, setItem] = useState<string>("product");
  const [resourceListLoading, setResourceListLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  function findProduct() {
    return (rule.rule_selector === 'cart_at_least' || rule.rule_selector === 'cart_at_most' || rule.rule_selector === 'cart_exactly' || rule.rule_selector === 'cart_does_not_contain' || rule.rule_selector === 'cart_contains_variant' || rule.rule_selector === 'cart_does_not_contain_variant' || rule.rule_selector === 'cart_contains_item_from_vendor' || rule.rule_selector === 'on_product_this_product_or_in_collection' || rule.rule_selector === 'on_product_not_this_product_or_not_in_collection')
  }

  function inputAmount() {
    return rule.rule_selector === 'total_at_least' || rule.rule_selector === 'total_at_most'
  }

  function inputCountry() {
    return rule.rule_selector === 'in_location' || rule.rule_selector === 'not_in_location'
  }

  const handleChange = (value, id) => {
    setRule(prev => ({ ...prev, [id]: value }))
  }

  const handleItemChange = (value) => {
    setItem(value);
  }

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch('/api/v2/merchant/element_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop: shopAndHost.shop, product: { query: childData, type: item }, json: true }),
    })
      .then((response) => { return response.json(); })
      .then((data) => {
        setResourceListLoading(false);
        setProductData(data);
      })
      .catch((error) => {
        setError(error);
        console.log("Error", error)
      })
  }

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    updateQuery(value);
  }, [item],
  );

  function updateSelectedProduct(title, id, selectedVariants) {
    const shopify_id = Array.isArray(id) ? id[id.length-1] : id;
    setRule(prev => ({ ...prev, item_type: item, item_shopify_id: shopify_id, item_name: title }))
  }

  function countryOptions(){
    const names = [{ value: '', label: 'Select a country' }]
    countriesList.map(([code, name]) => {
      names.push({ value: code, label: name })
    })
    return names;
  }

  if (error) { return <ErrorPage showBranding={false} />; }

  return (
    <>
      <LegacyStack distribution={'fillEvenly'}>
        <LegacyStack.Item>
          <Select
            label="Condition"
            options={condition_options}
            id='rule_selector'
            onChange={handleChange}
            value={rule.rule_selector}
          />
        </LegacyStack.Item>
        {rule.rule_selector === 'cart_at_least' || rule.rule_selector === 'cart_at_most' || rule.rule_selector === 'cart_exactly' ? (
          <LegacyStack.Item fill>
            <TextField
              label="Quantity"
              type="number"
              id="quantity"
              value={rule.quantity}
              onChange={handleChange}
              autoComplete="off"
              min={0}
              error={quantityErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {rule.rule_selector === 'cart_at_least' || rule.rule_selector === 'cart_at_most' || rule.rule_selector === 'cart_exactly' || rule.rule_selector === 'cart_does_not_contain' || rule.rule_selector === 'on_product_this_product_or_in_collection' || rule.rule_selector === 'on_product_not_this_product_or_not_in_collection' ? (
          <LegacyStack.Item fill>
            <Select
              label="Item"
              options={CartItemOptions}
              id='item_selector'
              onChange={handleItemChange}
              value={item}
            />
          </LegacyStack.Item>
        ) : null}
        {findProduct() ? (
          <>
            <LegacyStack.Item fill>
              <TextField
                label="Select product or collection"
                value={queryValue}
                onChange={handleQueryValueChange}
                autoComplete="off"
                placeholder='Search product or collection'
                error={itemErrorText}
              />
            </LegacyStack.Item>
            {productData ? (
              <LegacyStack.Item>
                <SearchProductsList item_type={item} shop={shopAndHost.shop} productData={productData} resourceListLoading={resourceListLoading} setResourceListLoading={setResourceListLoading} updateSelectedProduct={updateSelectedProduct} rule={rule}/>
              </LegacyStack.Item>
            ) : null
            }
          </>
        ) : null}
        {inputAmount() ? (
          <LegacyStack.Item fill>
            <TextField
              label="Enter the amount in cents (or your local equivalent)"
              type="number"
              id= "item_name"
              value={rule.item_name}
              onChange={handleChange}
              autoComplete="off"
              error={itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {inputCountry() ? (
          <LegacyStack.Item>
            <Select
              label="Select a country"
              options={countryOptions()}
              id='item_name'
              onChange={handleChange}
              value={rule.item_name}
              error={itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
        {(!findProduct() && !inputAmount()) && !inputCountry() ? (
          <LegacyStack.Item fill>
            <TextField
              label="Value"
              type="text"
              id="item_name"
              value={rule.item_name}
              onChange={handleChange}
              autoComplete="off"
              error={itemErrorText}
            />
          </LegacyStack.Item>
        ) : null}
      </LegacyStack>
    </>
  );
}
