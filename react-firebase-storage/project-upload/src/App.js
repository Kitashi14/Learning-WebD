import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

function App() {
  const [progress, setProgress] = useState(0);
  const formhandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadFiles = async (file) => {
    if (!file) return;

    try {
      const storageRef = ref(storage, `/files/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      console.log(uploadTask);

      uploadTask.on("state_changed", (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      });

      const url = await getDownloadURL(uploadTask.snapshot.ref);
      console.log(url);
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
      <h1>Uploaded {progress} %</h1>
    </div>
  );
}

export default App;
