/** @format */

import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

function App() {
  const [progress, setProgress] = useState("status");
  const formhandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadFiles = async (file) => {
    if (!file){ 
      setProgress("No file found to upload")
      return;
    }
    try {
      setProgress("Uploading...");
      console.log(file);
      const storageRef = ref(storage, `/files/${file.name}`);
      // https://console.firebase.google.com/project/test-1d748/storage/test-1d748.appspot.com/files/~2Ffiles 
      console.log(storageRef);

      const uploadTask = await uploadBytesResumable(storageRef, file);

      console.log(uploadTask);  

      const url = await getDownloadURL(uploadTask.ref);
      console.log(url);
      setProgress("Uploaded");  
      setTimeout(()=>{
        setProgress("status")
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <form onSubmit={formhandler}>
        <input type="file" className="input" required />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h1>{progress}</h1>
    </div>
  );
}

export default App;
