import React, { useEffect, useState } from 'react';

export default function useApi() {
  const api = 'http://localhost:3000/api/notes';
  const [data, setData] = useState();

  const fetchApi = async () => {
    try {
      // Use 'await' to wait for the fetch call to complete
      const response = await fetch(api);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Use 'await' to parse the JSON body
      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error("Could not fetch data: ", error);
    }
  };
  useEffect(() => {

    fetchApi();
  }, []); // The empty dependency array ensures this runs once when the component mounts

  // Return the fetched data
  return {data,fetchApi};
}
