import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDCmDItrH6uuo0iW9uVa2Ugkc93y7p1Ivc",
  authDomain: "student-complaint-cell-db.firebaseapp.com",
  databaseURL: "https://student-complaint-cell-db-default-rtdb.firebaseio.com",
  projectId: "student-complaint-cell-db",
  storageBucket: "student-complaint-cell-db.appspot.com",
  messagingSenderId: "445710679245",
  appId: "1:445710679245:web:95f517b824ed70177e7d84",
  measurementId: "G-HCY0YVNL9Y",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
