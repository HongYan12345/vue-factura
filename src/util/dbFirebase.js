import { doc, getDoc , setDoc, updateDoc, deleteDoc} from "firebase/firestore";
import { db } from "./firebaseConfig";

async function addDocument(collectionName, docId, data) {
    await setDoc(doc(db, collectionName, docId), data);
}

async function getDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return null;
    }
}

async function updateDocument(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId);
  
    await updateDoc(docRef, data);
}

async function deleteDocument(collectionName, docId) {
    await deleteDoc(doc(db, collectionName, docId));
}

async function syncData() {
    // 获取本地数据
    const localData = await getLocalData();

    // 获取 Firebase 数据
    const firebaseData = await getFirebaseData();

    if (localData.length > firebaseData.length) {
        // 如果本地数据比 Firebase 数据多，那么上传本地数据到 Firebase
        await uploadDataToFirebase(userId, localData);
    } else if (localData.length < firebaseData.length) {
        // 如果 Firebase 数据比本地数据多，那么下载 Firebase 数据到本地
        await downloadDataToLocal(userId, firebaseData);
    }
}