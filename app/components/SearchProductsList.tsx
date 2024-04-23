import {ResourceList, ResourceItem, OptionList} from '@shopify/polaris';
import { OptionDescriptor } from '@shopify/polaris/build/ts/src/types';
import {useState, useCallback} from 'react';
import { Product, Variant } from '~/types/types';

interface ISearchProductsListProps {
  item_type?: string;
  shop?: string;
  productData: Product[];
  resourceListLoading?: boolean;
  setResourceListLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  updateSelectedProduct?: (title?: string, id?: number | string[], selectedVariants?: any) => void;
  rule: any;
}


export function SearchProductsList(props: ISearchProductsListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState({})

  function handleSelectedVariant(selectedOptions: string[], id: number) {
    setSelectedVariants(selectedVariants => {
      return { ...selectedVariants, [id]: selectedOptions }
    })
    props.updateSelectedProduct && props.updateSelectedProduct('', id, selectedOptions);
  }
  
  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const items = [...props.productData];

  return (
    <>
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={selectionChange}
        showHeader={false}
        loading={props.resourceListLoading}
      />
    </>
  );

  function renderItem(item: Product) {
    const {id, title, image, variants} = item
    if(!variants){
      return (
        <ResourceItem
          id={String(id)}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(item)}
        >
          <p>
            <strong>{title}</strong>
          </p>

        </ResourceItem>
      );
    }
    if(variants.length <= 1)
    {
      return (
        <ResourceItem
          id={String(id)}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(item)}
        >
          <p>
            <strong>{title}</strong>
          </p>

        </ResourceItem>
      );
    }
    else {
      const option: OptionDescriptor[] = variants.map((currentValue: Variant) => {
        const label = currentValue.title;
        const value = String(currentValue.id);
        return { value, label };
      });
      return (
        <>
        <ResourceItem
          id={String(id)}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(item)}
        >
          <p>
            <strong>{title}</strong>
          </p>
        </ResourceItem>
        <div style={{ marginLeft: '30px' }}>
            <OptionList
            options={option}
            selected={selectedVariants[id]}
            onChange={(selectedOptions) => handleSelectedVariant(selectedOptions, id)}
            >
            </OptionList>
        </div>
        </>
      );
    }
  }

  function selectedProduct(item: Product) {
    if(props.item_type!=="product"){
      props.updateSelectedProduct && props.updateSelectedProduct(item.title, item.id);
      props.setResourceListLoading && props.setResourceListLoading(false);
      setSelectedItems([String(item.id)]);
    }
    else{
      selectionChange([String(item.id)]);
    }
  }

  function selectionChange (id: string[]) {
    if(selectedItems.length < id.length) {
      props.setResourceListLoading && props.setResourceListLoading(true);
      let shopifyId = id[id.length-1]
      let url = `/api/v2/merchant/products/shopify/${shopifyId}?shop=${props.shop}`

      fetch(url, {
        method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
       })
       .then( (response) => { return response.json(); })
       .then( (data) => {
        for(var i=0; i<props.productData.length; i++)
        {
          if(props.productData[i].id == Number(id[id.length-1])) {
            props.productData[i].variants = data.variants;
            break;
          }
          else {
          }
        }
        selectedVariants[id[id.length-1]] = [];
        for(var i=0; i<data.variants.length; i++) {
          selectedVariants[id[id.length-1]].push(data.variants[i].id); 
        }
        props.updateSelectedProduct && props.updateSelectedProduct(data.title, id, selectedVariants);
        props.setResourceListLoading && props.setResourceListLoading(false);
        setSelectedItems(id);
       })
       .catch((error) => {
       })
    }
    else {
      let uncheckedIndex;
      let tempArray: number[] = [];
      for (var i = 0; i < selectedItems.length; i++) {
        if (!id.includes(selectedItems[i])) {
          uncheckedIndex = i;
          break;
        }
      }
      for(var i=0; i<props.productData.length; i++)
      {
        if(props.productData[i].id == selectedItems[String(uncheckedIndex)]) {
          for(var j=0; j<props.productData[i].variants.length; j++) {
            tempArray[j] = props.productData[i].variants[j].id;
          }
          props.productData[i].variants = [];
          break;
        }
      }
      delete selectedVariants[selectedItems[uncheckedIndex]];
      props.updateSelectedProduct && props.updateSelectedProduct('', id, selectedVariants);
      setSelectedItems(id);
    }
  }
}