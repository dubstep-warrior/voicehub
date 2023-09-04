import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

const uploadImage = async (image: any, path: string) => {
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", image.uri, true);
    xhr.send(null);
  }); 

  const uriArray = image.uri.split("/");
  const storageRef = ref(storage, `${path}/${uriArray[uriArray.length - 1]}`);
  const res = await uploadBytes(storageRef, blob).then(async (snapshot) => {
    return await getDownloadURL(snapshot.ref)
  }).catch(err => console.log('failed to upload bytes', err)); 
  return res;
};

export default uploadImage;
