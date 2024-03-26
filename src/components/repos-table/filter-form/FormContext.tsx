import {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
} from "react";

import type { FilterFormSchema } from "./FilterForm";

type FormContext = {
  filters: FilterFormSchema | null;
  setFilters: Dispatch<SetStateAction<FilterFormSchema | null>>;
};
const FormContext = createContext<FormContext | null>(null);

interface FormContextProviderProps {
  children?: ReactNode;
}

export default function FormContextProvider({
  children,
}: FormContextProviderProps) {
  const [filters, setFilters] = useState<FilterFormSchema | null>(null);

  const filterEmptyFilters = useCallback((filters: FilterFormSchema) => {
    return Object.entries(filters)
      .filter(([k, v]) => {
        if (k === "textIn") {
          // there should be a better typesafe way to do this
          // but for now this will do
          return !!v && !!v.text;
        }
        return !!v;
      })
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {} as FilterFormSchema);
  }, []);

  const setSafeFilters = useCallback(
    (filters: FilterFormSchema | null) => {
      if (!filters) return;
      const f = filterEmptyFilters(filters);
      setFilters(f);
    },
    [setFilters, filterEmptyFilters]
  );

  return (
    <FormContext.Provider
      value={{
        filters,
        setFilters: setSafeFilters,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export const useFilterForm = () => {
  const data = useContext(FormContext);

  return {
    filters: data?.filters,
    setFilters: data?.setFilters,
  };
};
