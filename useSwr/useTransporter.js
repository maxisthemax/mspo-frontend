import { useState } from "react";
import axios from "utils/http-anxios";
import useSwrHttp from "./useSwrHttp";
import useUser from "./useUser";

export default function useTransporter() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState();

  const { data, mutate, error, isValidating } = useSwrHttp("transporters", {
    pagination: { page, pageSize },
    sort: sort,
    populate: "*",
  });

  const { userData } = useUser();

  const resetTransporterSort = () => {
    setSort();
  };

  const addTransporter = async ({ name }) => {
    await axios.post("tickets", {
      data: {
        name: name,
        createdBy: userData.id,
      },
    });
    resetTransporterSort();
    mutate();
  };

  return {
    transporterData: data,
    mutate,
    addTransporter,
    error,
    isValidating,
    transporterPage: page,
    setTransporterPage: setPage,
    transporterPageSize: pageSize,
    setTransporterPageSize: setPageSize,
    transporterSort: sort,
    setTransporterSort: setSort,
    resetTransporterSort,
  };
}
