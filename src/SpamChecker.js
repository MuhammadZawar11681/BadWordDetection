// import React, { useState, useEffect } from "react";
// import { database } from "./firebaseConfig";
// import { ref, get, child, update } from "firebase/database";

// const spamWords = ["stupid", "sexy"]; // Add your list of spam words here

// const SpamChecker = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const dbRef = ref(database);
//     // Fetch data from the 'Add_Complaint' table
//     get(child(dbRef, "Add_Complaint"))
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const modifiedData = processDescriptions(data);
//           setComplaints(modifiedData);
//           setLoading(false);
//         } else {
//           console.log("No data available");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data: ", error);
//       });
//   }, []);

//   const processDescriptions = (data) => {
//     // Iterate through each complaint and check the description for spam words
//     Object.keys(data).forEach((key) => {
//       let description = data[key].description;
//       spamWords.forEach((word) => {
//         const regex = new RegExp(`\\b${word}\\b`, "gi");
//         description = description.replace(regex, "[Deleted Spam word]");
//       });
//       // Update the Firebase database with the modified description
//       const updates = {};
//       updates[`Add_Complaint/${key}/description`] = description;
//       update(ref(database), updates);
//       data[key].description = description; // Update the local state with the modified description
//     });
//     return data;
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Complaints</h1>
//       <ul>
//         {Object.keys(complaints).map((key) => (
//           <li key={key}>
//             <strong>ID:</strong> {complaints[key].C_ID} <br />
//             <strong>Description:</strong> {complaints[key].description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { Filter } from "bad-words";
import { database } from "./firebaseConfig"; // Import the initialized database

const SpamChecker = () => {
  const [complaints, setComplaints] = useState([]);
  const filter = new Filter(); // Create an instance of the Filter

  useEffect(() => {
    const complaintsRef = ref(database, "Add_Complaint"); // Use the initialized database

    onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const complaintsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Check each complaint for spam
        const modifiedComplaints = complaintsArray.map((complaint) => {
          if (filter.isProfane(complaint.description)) {
            // Modify the description and append "[Spam detected]"
            const cleanDescription =
              filter.clean(complaint.description) + " [Spam detected]";

            // Update the modified complaint in Firebase
            update(ref(database, `Add_Complaint/${complaint.id}`), {
              description: cleanDescription,
            });

            return { ...complaint, description: cleanDescription };
          }
          return complaint;
        });

        setComplaints(modifiedComplaints);
      }
    });
  }, []);

  return (
    <div>
      <h1>Complaints List (Filtered for Spam)</h1>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>
            <strong>ID:</strong> {complaint.id}, <strong>Description:</strong>{" "}
            {complaint.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpamChecker;
