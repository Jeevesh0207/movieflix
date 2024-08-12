import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_URL;

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/${contentType}/trending`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt-netflix")}`,
          },
        });
        // Ensure to await the response JSON parsing
        const data = await res.json();
        console.log(data);
        setTrendingContent(data.content);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    getTrendingContent();
  }, [contentType]);

  console.log(trendingContent);

  return { trendingContent };
};

export default useGetTrendingContent;
