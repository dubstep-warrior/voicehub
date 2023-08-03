import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase" 

const uploadImage = async (image: any, path: string) => {
  console.log('uploading image', image)
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
  console.log('got image blob, now uploading bytes')
  const uriArray = image.uri.split('/')
  const storageRef = ref(storage, `${path}/${uriArray[uriArray.length - 1]}`)
  const res = await uploadBytes(storageRef, blob).then(async (snapshot) => {
    console.log('Uploaded a blob or file!');
    return await getDownloadURL(snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      return downloadURL;
    });
  });
  return res
}

export default uploadImage