import { useCallback, useState } from "react";

export const usePagination = (data: Array<any>, itensPerPage: number) => {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const startItemIndex = (page - 1) * pageSize + 1;
  const endItemIndex = Math.min(startItemIndex + pageSize - 1, totalItems);

  const handleNextPage = useCallback(() => {
    setPage(prev => prev + 1)
    //setPageSize(prev => prev + 10)

  }, [])

  const handlePreviewPage = useCallback(() => {
    setPage(prev => prev - 1)

  }, [])


  const handleCurrentPage = useCallback((page: number) => {
    setPage(page)
  }, [])


  return {

  }

};