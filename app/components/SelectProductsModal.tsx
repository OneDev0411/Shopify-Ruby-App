import {useState, useEffect, memo} from 'react';
import {useSelector} from 'react-redux';
import {ModalAddProduct} from './modal_AddProduct';
import {useAuthenticatedFetch} from "~/hooks";
import { Offer, ProductDetails, Shop } from "~/types/types";

interface ISelectProductsModalProps {
  offer: Offer,
  shop: Shop,
  selectedProducts: ProductDetails[],
  setSelectedProducts: (prodDetails: ProductDetails[]) => void,
  selectedItems: (number | string)[],
  setSelectedItems: () => void,
  handleProductsModal: () => void,
}

export function SelectProductsModal({
                                      offer, selectedProducts, setSelectedProducts, handleProductsModal,
                                      setSelectedItems, selectedItems, shop
                                    }: ISelectProductsModalProps) {
  // @ts-ignore
  const shopAndHost = useSelector(state => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);

  const [productData, setProductData] = useState<ProductDetails[]>([]);
  const [resourceListLoading, setResourceListLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  function updateQuery(childData) {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({product: {query: childData, type: 'product'}, shop: shopAndHost.shop}),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (!Object.keys(offer.included_variants).includes(data[i].id.toString())) {
            data[i].variants = [];
          }
        }
        setProductData(data);
        setResourceListLoading(false);
      })
      .catch((error) => {
        console.log("Error > ", error);
      })

    setQuery(childData);
  }

  function getProducts() {
    setResourceListLoading(true);
    fetch(`/api/v2/merchant/element_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({product: {query: query, type: 'product'}, shop: shopAndHost.shop}),
    })
      .then((response: Response) => {
        return response.json()
      })
      .then((data: ProductDetails[]) => {
        for (let i = 0; i < data.length; i++) {
          if (!Object.keys(offer.included_variants).includes(data[i].id.toString())) {
            data[i].variants = [];
          }
        }
        setProductData(data);
        setResourceListLoading(false)
        return data
      })
      .catch((error) => {
        console.log("# Error getProducts > ", JSON.stringify(error));
      })
  }

  function updateSelectedProducts(selectedItem: ProductDetails) {
    if (selectedItem.id) {
      selectedProducts.push(selectedItem);
    } else {
      const products = selectedProducts.filter(item => selectedItem.id === item.id);
      setSelectedProducts(products);
    }
  }


  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <ModalAddProduct selectedItems={selectedItems} setSelectedItems={setSelectedItems} offer={offer}
                       updateQuery={updateQuery} shop_id={shop.shop_id} productData={productData}
                       resourceListLoading={resourceListLoading} setResourceListLoading={setResourceListLoading}
                       updateSelectedProduct={updateSelectedProducts}/>
    </>
  );
}

export default memo(SelectProductsModal);
