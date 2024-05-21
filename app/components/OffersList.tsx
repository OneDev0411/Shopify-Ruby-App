import {
  Button,
  TextField,
  IndexTable,
  Filters,
  useIndexResourceState,
  Badge,
  Pagination,
  Select,
  Card,
  Modal,
  Spinner
} from '@shopify/polaris';

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "@remix-run/react";
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from "react-redux";
import {
  OffersListSortOptions,
  OffersResourceName
} from './shared/constants/other';
import {CreateOfferCard} from "./CreateOfferCard.jsx";
import {Redirect} from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import ErrorPage from "./ErrorPage";
import UpgradeSubscriptionModal from "./UpgradeSubscriptionModal";
import { IRootState } from '~/store/store';

interface IOffersListProps {
  pageSize?: number;
}

type OfferData = {
  clicks: number;
  created_at: string;
  id: number;
  offerable_type: string;
  revenue: number;
  status: boolean;
  title: string;
  views: number;
}

export function OffersList({ pageSize }: IOffersListProps) {
  const app = useAppBridge();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taggedWith, setTaggedWith] = useState<string | null>('');
  const [queryValue, setQueryValue] = useState<string | null>(null);
  const [offersData, setOffersData] = useState<OfferData[]>([]);
  const [sortValue, setSortValue] = useState<string>('today');
  const [filteredData, setFilteredData] = useState<OfferData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const fetch = useAuthenticatedFetch(shopAndHost.host);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalActive, setModalActive] = useState(false);

  const [offersLimitReached, setOffersLimitReached] = useState<boolean>(false);
  const [offersLimit, setOffersLimit] = useState<number>();
  const [openOffersModal, setOpenOffersModal] = useState<boolean>(false);

  const toggleModal = useCallback(() => {
    setModalActive(!modalActive)
  }, [modalActive]);

  useEffect(() => {
    let redirect = Redirect.create(app);
    fetch('/api/v2/merchant/offers_list', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ shop: shopAndHost.shop }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.redirect_to) {
          redirect.dispatch(Redirect.Action.APP, data.redirect_to);
      } else {
        console.log('API Data >>> ', data);
        // localStorage.setItem('icushopify_domain', data.shopify_domain);
        setOffersData(data.offers);
        setFilteredData(data.offers);
        setOffersLimitReached(data.offers_limit_reached);
        setOffersLimit(data.offers_limit);
        setIsLoading(false);
      }}).catch((error) => {
        setError(error);
        console.log('Fetch error >> ', error);
      });
  }, []);

  // Pagination configuration
  const itemsPerPage = pageSize || 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(paginatedData);

  // Handle pagination page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueChange = useCallback((value) => {
    setFilteredData(offersData.filter((o) => o.title.toLowerCase().includes(value.toLowerCase())));
  }, []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const handleSortChange = useCallback((value: string) => {
    if(value == "date_asc") {
      filteredData.sort((a, b) => new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf());
    }
    else if(value == "date_des") {
      filteredData.sort((a, b) => new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf());
      filteredData.reverse();
    }
    else if (value == "clicks") {
      filteredData.sort(function(a, b) {
        return b.clicks - a.clicks;
      });
    }
    else if (value == "revenue") {
      filteredData.sort(function(a, b) {
        return b.revenue - a.revenue;
      });
    }
    setSortValue(value)
  }, []);

  const isAutoPilot = paginatedData.find(obj => obj['id'] === Number(selectedResources[0]))?.offerable_type == 'auto'
  const promotedBulkActions = ((selectedResources.length == 1 && isAutoPilot)) ? 
  [
    {
      content: 'Publish',
      onAction: () => activateSelectedOffer(),
    },
  ] : [
    {
      content: 'Duplicate Offer',
      onAction: () => { createDuplicateOffer();},
    },
  ];
  const bulkActions = ((selectedResources.length == 1 && isAutoPilot) || (selectedResources.length > 1 && offersLimit === 1)) ?
  [
    {
      content: 'Unpublish',
      onAction: () => deactivateSelectedOffer(),
    },
    {
      content: 'Delete',
      onAction: () => deleteSelectedOffer(),
    },
  ] : [
    {
      content: 'Publish',
      onAction: () => activateSelectedOffer(),
    },
    {
      content: 'Unpublish',
      onAction: () => deactivateSelectedOffer(),
    },
    {
      content: 'Delete',
      onAction: () => deleteSelectedOffer(),
    },
  ];

  const filters = [
    {
      key: 'taggedWith',
      label: 'Filter',
      filter: (
        <TextField
          label="Filter by "
          value={taggedWith || ""}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
        key: 'filteredby',
        label: disambiguateLabel('taggedWith', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const rowMarkup = paginatedData.map(
    ({ id, title, status, clicks, views, revenue }, index) => (
      <IndexTable.Row
        id={String(id)}
        key={id}
        selected={selectedResources.includes(String(id))}
        position={index}
      >
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{status ? (<Badge tone="success">Published</Badge>) : (<Badge>Unpublished</Badge>)}</IndexTable.Cell>
        <IndexTable.Cell>{clicks}</IndexTable.Cell>
        <IndexTable.Cell>{views}</IndexTable.Cell>
        <IndexTable.Cell>{`$${revenue}`}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleViewOffer(id)}>
            Edit
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  function createDuplicateOffer() {
    selectedResources.forEach(function (resource) {
      if(paginatedData.find(obj => obj['id'] === Number(resource))?.offerable_type != 'auto')
      {
        let url = `/api/v2/merchant/offers/${resource}/duplicate`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ offer_id: resource, shop: shopAndHost.shop })
        })
          .then((response) => response.json())
          .then((data) => {
            setFilteredData(data.offers);
            setOffersData(data.offers);
            selectedResources.shift();
          })
        .catch(() => {
          setError(error);
        })
      }
      else {
        setModalActive(paginatedData.find(obj => obj['id'] === Number(resource))?.offerable_type == 'auto');
        selectedResources.shift();
      }
    });
  }

  function deleteSelectedOffer() {
    selectedResources.forEach(function (resource) {
      let url = `/api/v2/merchant/offers/${resource}`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer_id: resource, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then((data) => {
          setFilteredData(data.offers);
          setOffersData(data.offers);
          selectedResources.shift();
        })
        .catch((error) => {
          setError(error);
        })
    });
  }

  function activateSelectedOffer() {
    if (offersLimitReached) {
      setOpenOffersModal(true);
    } else {
      selectedResources.forEach(function (resource) {
        let url = '/api/v2/merchant/offer_activate';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ offer: { offer_id: resource }, shop: shopAndHost.shop })
        })
          .then((response) => response.json())
          .then(() => {
            const dataDup = [...offersData].map((o) => o.id == Number(resource) ? ({...o, status: false}) : (o));
            setOffersData([...dataDup]);
            selectedResources.shift();
          })
          .catch((error) => {
            setError(error);
          })
      });
    }
  }

  function deactivateSelectedOffer() {
    selectedResources.forEach(function (resource) {
      let url = '/api/v2/merchant/offer_deactivate';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer: { offer_id: resource }, shop: shopAndHost.shop })
      })
        .then((response) => response.json())
        .then(() => {
          const dataDup = [...offersData].map((o) => o.id == Number(resource) ? ({...o, status: false}) : (o));

          setOffersData([...dataDup]);
          selectedResources.shift();
        })
        .catch((error) => {
          setError(error);
        })
    });
  }

  const navigateTo = useNavigate();

  const handleViewOffer = (offer_id: number) => {
    localStorage.setItem('Offer-ID', String(offer_id));

    navigateTo(`/app/edit-offer-view`, { state: { offerID: offer_id } });
  }

  if (error) { return < ErrorPage showBranding={false} />; 
}
  return (
    <div className="narrow-width-layout">
      {isLoading ? (
        <div
          style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spinner size="large" />
        </div>
      ) : (
        <>
          {offersData.length === 0 ? (
            <CreateOfferCard />
          ) : (
            <>
              <Card>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <Filters
                      queryPlaceholder="Filter Items"
                      queryValue={queryValue ?? ''}
                      filters={filters}
                      appliedFilters={appliedFilters}
                      onQueryChange={handleQueryValueChange}
                      onQueryClear={handleQueryValueRemove}
                      onClearAll={handleClearAll}
                    />
                  </div>
                  <div style={{ paddingLeft: '0.25rem' }}>
                    <Select
                      labelInline
                      label="Sort"
                      options={OffersListSortOptions}
                      value={sortValue}
                      onChange={handleSortChange}
                    />
                  </div>
                </div>
                <IndexTable
                  sortable={[false, false, true, true, true]}
                  sortDirection={'descending'}
                  sortColumnIndex={4}
                  resourceName={OffersResourceName}
                  itemCount={paginatedData.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  hasZebraStriping
                  bulkActions={bulkActions}
                  promotedBulkActions={promotedBulkActions}
                  headings={[
                    { title: 'Offer' },
                    { title: 'Status' },
                    { title: 'Clicks' },
                    { title: 'Views' },
                    { title: 'Revenue', hidden: false },
                    { title: '', hidden: false }
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
                <Modal
                  open={modalActive}
                  onClose={toggleModal}
                  title="Alert Message"
                  primaryAction={{
                    content: 'OK',
                    onAction: toggleModal,
                  }}
                  >
                  <Modal.Section>
                      <p>Autopilot Offer cannot be duplicated.</p>
                  </Modal.Section>
                  </Modal>
                <div className="space-4"></div>
                <div className="offer-table-footer">
                  <Pagination
                    label={`${currentPage} of ${totalPages}`}
                    hasPrevious={currentPage > 1}
                    hasNext={currentPage < totalPages}
                    onPrevious={() => handlePageChange(currentPage - 1)}
                    onNext={() => handlePageChange(currentPage + 1)}
                  />
                </div>
              </Card>
            </>
          )}
        </>
      )}
      <div className="space-10"></div>
      <UpgradeSubscriptionModal openModal={openOffersModal} setOpenModal={setOpenOffersModal} />
    </div>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Filter by ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}