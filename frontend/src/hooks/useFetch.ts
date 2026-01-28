import { useEffect, useState } from "react";

export interface Review {
  id: number;
  documentId: string;
  title: string;
  rating: number;
  body: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json.data);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { loading, error, data };
};

export default useFetch;
