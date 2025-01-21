import React, { useEffect } from "react";
import { Winery } from "../../../model/Winery";
import { Catalogue } from "../../../model/Catalogue";
import { CommunicationResult, isSuccess } from "../../../communication/CommunicationsResult";
import { CatalogueRepository } from "../../../communication/repositories/CatalogueRepository";

type Props = {
  catalogue: Catalogue
}
export function useWineriesList({ catalogue }: Props) {

  const [items, setItems] = React.useState<Winery[]>([]);
  const [paginatedItems, setPaginatedItems] = React.useState<Winery[]>([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 20; // Number of items per page, adjust as necessary

  useEffect(() => {
    const fetchWineries = async () => {
      const res: CommunicationResult<Winery[]> = await CatalogueRepository.getParticipatedWineries(catalogue);
      if (isSuccess(res)) {
        setItems(res.data);
        loadWineries(res.data);
      }
    }

    fetchWineries();
  }, []);

  const loadWineries = async (items: Winery[], currentOffset: number = 0) => {
    setIsLoading(true);

    const slicedItems = items.slice(currentOffset, currentOffset + limit);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setHasMore(items.length > paginatedItems.length);
    setPaginatedItems((prevItems) => {
      const filtered = slicedItems.filter((item) => !prevItems.some((prevItem) => prevItem.id === item.id));
      console.log([...prevItems, ...filtered])
      return [...prevItems, ...filtered]
    }
  );

    setIsLoading(false);
  };

  const onLoadMore = () => {
    const newOffset = offset + limit;

    setOffset(newOffset);
    loadWineries(items, newOffset);
  };

  return {
    paginatedItems,
    hasMore,
    isLoading,
    onLoadMore,
  };
}