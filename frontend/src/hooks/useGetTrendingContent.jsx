import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        const res = await axios.get(BASE_URL + `/api/v1/${contentType}/trending`, {
          withCredentials:true,
        });
        setTrendingContent(res.data.content);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    getTrendingContent();
  }, [contentType]);

  console.log({ trendingContent });

  return { trendingContent };
};

export default useGetTrendingContent;
