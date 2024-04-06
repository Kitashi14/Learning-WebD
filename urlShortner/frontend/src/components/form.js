/** @format */

import { useRef, useState } from "react";

const Form = (props) => {
  const urlRef = useRef();

  const [urlId, setUrlId] = useState(null);

  const createUrlShortner = async () => {
    const url = urlRef.current.value;
    if (url.length === 0) {
      alert("enter a valid url");
      return;
    }
    console.log(url);

    // calling the api
    try {
      const data = {
        url,
      };
      const response = await fetch("http://localhost:6002/api/createShortUrl", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);

      if(response.status===200){
        setUrlId(responseData.id);
      }
      else if(response.status===400){
        alert("Url already exist.");
        setUrlId(responseData.id);
      }else if(response.status){
        alert("Something wrong with the server. Try after sometime.");
      }

    } catch (err) {
      console.log(err);
      alert("Something wrong happened");
    }
  };

  return (
    <div>
      <h2>Url Shortner</h2>

      <input ref={urlRef} type="text" />

      <button onClick={createUrlShortner}> Create </button>

      {urlId !== null ? (
        <>
          <div>{`http://localhost:3000/url/${urlId}`}</div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Form;
