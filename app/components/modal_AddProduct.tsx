import {
  Filters,
  ResourceList,
  ResourceItem,
  OptionList,
  Text, Thumbnail,
} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useAuthenticatedFetch} from '~/hooks';
import { IRootState } from '~/store/store';
import {Offer, Product, ProductDetails, ProductVariants} from "~/types/types";

interface IModalAddProductProps {
  offer: Offer,
  updateQuery: (value: string) => void,
  isCollection?: boolean,
  productData: ProductDetails[],
  selectedItems: (string | number)[],
  setSelectedItems: React.Dispatch<React.SetStateAction<(string | number)[]>>,
  resourceListLoading: boolean,
  updateSelectedProduct?: (selectedProduct: ProductDetails, variants: ProductVariants) => void,
  updateSelectedProducts?: (p: { id: any; title: any }, selectedVariants: ProductVariants) => void
  updateSelectedCollection?: (selectedItem?: ProductDetails, uncheck?: boolean) => void,
  setResourceListLoading: (resListLoading: boolean) => void,
  shop_id: number | undefined,
}

export function ModalAddProduct({
                                  offer, productData, updateSelectedProduct, updateSelectedProducts,
                                  updateSelectedCollection, updateQuery, isCollection, setSelectedItems,
                                  selectedItems, setResourceListLoading, resourceListLoading, shop_id
                                }: IModalAddProductProps) {

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const [selectedVariants, setSelectedVariants] = useState<ProductVariants>(offer.included_variants);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState<string>("");
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  let timer: string | number | NodeJS.Timeout | undefined;

  const p = Array.isArray(productData) ? productData : [] 

  const handleQueryValueChange = useCallback((value: string) => {
    updateQuery(value);
  }, []);
  const WaitForQueryToComplete = useCallback((value) => {
    setQueryValue(value);
    clearTimeout(timer);

    timer = setTimeout(() => {
      handleQueryValueChange(value);
    }, 1000);
  }, []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    timer = setTimeout(() => {
      handleQueryValueChange("");
    }, 1000);
  }, []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = isCollection ? {
    singular: 'collection',
    plural: 'collections',
  } : {
    singular: 'product',
    plural: 'products',
  };

  const appliedFilters: {
    label: any;
    onRemove: () => void;
    key: string,
    filter: React.ReactNode
  }[] = !isEmpty(taggedWith)
    ? [
      {
        key: 'taggedWith3',
        label: disambiguateLabel('taggedWith3', taggedWith),
        onRemove: handleTaggedWithRemove,
        filter: <></>
      },
    ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={appliedFilters}
      appliedFilters={appliedFilters}
      onQueryChange={WaitForQueryToComplete}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div id="right-align-polaris">
      <ResourceList
        resourceName={resourceName}
        items={p}
        renderItem={renderItem}
        selectedItems={selectedItems as string[]}
        onSelectionChange={selectionChange}
        selectable
        showHeader={false}
        filterControl={filterControl}
        loading={resourceListLoading}
      />
    </div>
  );

  function renderItem(item: ProductDetails) {

    const {id, title, image, variants} = item;
    const media = <Thumbnail
      source={image}
      alt={title}
      size="medium"
    />
    if (!variants || variants.length <= 1) {
      return (
        <ResourceItem
          id={id.toString()}
          key={id}
          name={title}
          verticalAlignment="center"
          media={media}
          accessibilityLabel={`View details for ${title}`}
          persistActions
          onClick={() => selectedProduct(id)}
        >
          <Text as="h3" variant="bodyMd" fontWeight="regular">
            {title}
          </Text>
        </ResourceItem>
      );
    } else {
      const option = variants?.map((currentValue) => {
        const label = currentValue.title;
        const value = currentValue.id;
        return {value, label};
      });
      return (
        <>
          <ResourceItem
            id={id.toString()}
            key={id}
            name={title}
            media={media}
            accessibilityLabel={`View details for ${title}`}
            persistActions
            onClick={() => selectedProduct(id)}
            verticalAlignment="center"
          >
            <Text as="h3" variant="bodyMd" fontWeight="regular">
              {title}
            </Text>
          </ResourceItem>
          <div style={{marginLeft: '30px'}}>
            <OptionList
              options={option}
              selected={selectedVariants[id] as string[]}
              onChange={(selectedOptions) => handleSelectedVariant(selectedOptions, id)}
              allowMultiple
            />
          </div>
          <hr style={{borderTop: '0.2px solid #f0f0f0', marginBottom: 0}}/>
        </>
      );
    }
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith3':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value: string | any[] | null) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }

  //Called when the selected product or variants of selected product changes in popup modal
  function handleSelectedVariant(selectedOptions, id) {
    setSelectedVariants(selectedVariants => {
      return {...selectedVariants, [id]: selectedOptions}
    })
    if (updateSelectedProduct) {
      updateSelectedProduct(id, selectedOptions);
    }
  }

  // Called on just first selection of popup modal products
  function selectedProduct(id) {
    let idToArray = [id];
    selectionChange(idToArray);
  }

  // Called on every selection of popup modal products after first selected product
  function selectionChange(id) {
    if (shop_id === undefined) {
      return; // Return early if shop_id is undefined
    }
    if (!isCollection) {
      if (selectedItems.length < id.length) {
        setResourceListLoading(true);
        let shopifyId = id[id.length - 1]
        fetch(`/api/v2/merchant/products/shopify/${shopifyId}?shop_id=${shop_id}&shop=${shopAndHost.shop}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response: Response) => {
            return response.json()
          })
          .then((data: Product) => {
            for (let i = 0; i < productData.length; i++) {
              if (productData[i].id == id[id.length - 1]) {
                productData[i].variants = data.variants;
                break;
              }
            }
            selectedVariants[id[id.length - 1]] = [];
            for (let i = 0; i < data.variants?.length; i++) {
              selectedVariants[id[id.length - 1]].push(data.variants[i].id);
            }
            if (updateSelectedProduct) {
              updateSelectedProduct(id, selectedVariants);
            } else if (updateSelectedProducts) {
              updateSelectedProducts({id: data.id, title: data.title}, selectedVariants);
            }
            setResourceListLoading(false);
            setSelectedItems(id)
          })
          .catch((error) => {
            console.log("Error ", error);
          })
      } else {
        let uncheckedIndex: number = 0;
        let tempArray: number[] = [];

        for (let i = 0; i < selectedItems.length; i++) {
          if (!id.includes(selectedItems[i])) {
            uncheckedIndex = i;
            break;
          }
        }
        for (let i = 0; i < productData.length; i++) {
          if (productData[i].id == selectedItems[uncheckedIndex]) {
            for (let j = 0; j < productData[i].variants?.length; j++) {
              tempArray[j] = productData[i].variants[j].id;
            }
            productData[i].variants = [];
            break;
          }
        }
        delete selectedVariants[selectedItems[uncheckedIndex]];
        if (updateSelectedProduct) {
          updateSelectedProduct(id, selectedVariants);
        } else if (updateSelectedProducts) {

          updateSelectedProducts(id, selectedVariants);
        }
        setSelectedItems(id);
      }
    } else {
      const coll: ProductDetails | undefined = productData.find(item => item.id === id[id.length - 1]);
      if (updateSelectedCollection) {
        if (selectedItems.length <= id.length && coll) {
          updateSelectedCollection(coll);
        } else {
          if (coll) {
            updateSelectedCollection(coll, true);
          } else {
            updateSelectedCollection(undefined);
          }
        }
        setResourceListLoading(false);
        setSelectedItems(id);
      }
    }
  }
}
