import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ModalAddProduct} from './modal_AddProduct';
import {useAuthenticatedFetch} from "~/hooks";
import { Offer, ProductDetails } from "~/types/types";

interface ISelectCollectionsModalProps {
  offer: Offer,
  setSelectedCollections: (selectedColl: ProductDetails[]) => void,
  selectedCollections: ProductDetails[],
  setSelectedItems: (selectedItems: (number | string)[]) => void,
  selectedItems: (number | string)[],
  shop: Shop,
}

export function SelectCollectionsModal({ offer, setSelectedCollections, selectedCollections,
                                         setSelectedItems, selectedItems, shop
                                       }: ISelectCollectionsModalProps) {


  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [collectionData, setCollectionData] = useState<ProductDetails[]>({} as ProductDetails[]);
  const [resourceListLoading, setResourceListLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({product: {query: childData, type: 'collection'}, shop: shopAndHost.shop}),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        loadState(data)
      })
      .catch((error) => {
        console.log("Error > ", error);
      })

    setQuery(childData);
  }

  function getCollections() {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({product: {query: query, type: 'collection'}, shop: shopAndHost.shop}),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        loadState(data)
      })
      .catch((error) => {
        console.log("# Error getProducts > ", JSON.stringify(error));
      })
  }

  function updateSelectedCollection(selectedItem: ProductDetails | undefined, uncheck: boolean = false) {
    if (selectedItem == null) {
      setSelectedCollections([]);
      return;
    }
    if (!uncheck) {
      selectedCollections.push(selectedItem);
    } else {
      const collections = selectedCollections.filter(item => item.id === selectedItem.id);
      setSelectedCollections(collections);
    }
  }

  function loadState(fetchedData: any[]) {
    for (let i = 0; i < fetchedData.length; i++) {
      if (!Object.keys(offer.included_variants).includes(fetchedData[i].id.toString())) {
        fetchedData[i].variants = [];
      }
    }
    setCollectionData(fetchedData);
    setResourceListLoading(false);
  }

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <>
      <ModalAddProduct selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                       isCollection={true} offer={offer} updateQuery={updateQuery} shop_id={shop.shop_id}
                       productData={collectionData} resourceListLoading={resourceListLoading}
                       updateSelectedCollection={updateSelectedCollection}
                       setResourceListLoading={setResourceListLoading}/>
    </>
  );
}
