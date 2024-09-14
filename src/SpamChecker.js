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

// import React, { useEffect, useState } from "react";
// import { ref, onValue, update } from "firebase/database";
// import { Filter } from "bad-words";
// import { database } from "./firebaseConfig"; // Import the initialized database

// const SpamChecker = () => {
//   const [complaints, setComplaints] = useState([]);
//   const filter = new Filter(); // Create an instance of the Filter

//   useEffect(() => {
//     const complaintsRef = ref(database, "Add_Complaint"); // Use the initialized database

//     onValue(complaintsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const complaintsArray = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));

//         // Check each complaint for spam
//         const modifiedComplaints = complaintsArray.map((complaint) => {
//           if (filter.isProfane(complaint.description)) {
//             // Modify the description and append "[Spam detected]"
//             const cleanDescription =
//               filter.clean(complaint.description) + " [Spam detected]";

//             // Update the modified complaint in Firebase
//             update(ref(database, `Add_Complaint/${complaint.id}`), {
//               description: cleanDescription,
//             });

//             return { ...complaint, description: cleanDescription };
//           }
//           return complaint;
//         });

//         setComplaints(modifiedComplaints);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Complaints List (Filtered for Spam)</h1>
//       <ul>
//         {complaints.map((complaint) => (
//           <li key={complaint.id}>
//             <strong>ID:</strong> {complaint.id}, <strong>Description:</strong>{" "}
//             {complaint.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

// import React, { useEffect, useState } from "react";
// import { ref, onValue, update, remove, set } from "firebase/database"; // Added 'remove' and 'set' for deleting and adding data
// import { Filter } from "bad-words";
// import { database } from "./firebaseConfig"; // Import the initialized database

// const SpamChecker = () => {
//   const [spamMessages, setSpamMessages] = useState([]); // State to hold spam messages
//   const [nonSpamComplaints, setNonSpamComplaints] = useState([]); // State for non-spam messages
//   const filter = new Filter(); // Create an instance of the Filter

//   useEffect(() => {
//     const complaintsRef = ref(database, "Add_Complaint"); // Reference to Add_Complaint

//     onValue(complaintsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const complaintsArray = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));

//         const spam = [];
//         const nonSpam = [];

//         // Check each complaint for spam
//         complaintsArray.forEach((complaint) => {
//           if (filter.isProfane(complaint.description)) {
//             // If spam, modify the description, move to Spam_Messages and remove from Add_Complaint
//             const cleanDescription =
//               filter.clean(complaint.description) + " [Spam detected]";

//             // Move to Spam_Messages table
//             set(ref(database, `Spam_Messages/${complaint.id}`), {
//               ...complaint,
//               description: cleanDescription,
//             });

//             // Remove from Add_Complaint
//             remove(ref(database, `Add_Complaint/${complaint.id}`));

//             // Add to spam list for local state
//             spam.push({ ...complaint, description: cleanDescription });
//           } else {
//             nonSpam.push(complaint); // Add to non-spam list
//           }
//         });

//         // Update the state with spam and non-spam complaints
//         setSpamMessages(spam);
//         setNonSpamComplaints(nonSpam);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Complaints List (Filtered for Spam)</h1>
//       <ul>
//         {nonSpamComplaints.map((complaint) => (
//           <li key={complaint.id}>
//             <strong>ID:</strong> {complaint.id}, <strong>Description:</strong>{" "}
//             {complaint.description}
//           </li>
//         ))}
//       </ul>

//       <h2>Spam Messages</h2>
//       <ul>
//         {spamMessages.map((spam) => (
//           <li key={spam.id}>
//             <strong>ID:</strong> {spam.id}, <strong>Description:</strong>{" "}
//             {spam.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

// import React, { useEffect, useState } from "react";
// import { ref, onValue, update, set, remove } from "firebase/database";
// import { Filter } from "bad-words";
// import { database } from "./firebaseConfig"; // Import the initialized database

// const SpamChecker = () => {
//   const [complaints, setNonSpamComplaints] = useState([]); // Non-spam complaints
//   const [spamMessages, setSpamMessages] = useState([]); // Spam messages
//   const filter = new Filter(); // Create an instance of the Filter

//   useEffect(() => {
//     // Fetch complaints from Add_Complaint
//     const complaintsRef = ref(database, "Add_Complaint");

//     onValue(complaintsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const complaintsArray = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));

//         const nonSpam = [];

//         // Check each complaint for spam and move spam to Spam_Messages
//         complaintsArray.forEach((complaint) => {
//           if (filter.isProfane(complaint.description)) {
//             const cleanDescription =
//               filter.clean(complaint.description) + " [Spam detected]";

//             // Move the spam message to Spam_Messages table
//             set(ref(database, `Spam_Messages/${complaint.id}`), {
//               ...complaint,
//               description: cleanDescription,
//             });

//             // Remove the spam message from Add_Complaint
//             remove(ref(database, `Add_Complaint/${complaint.id}`));
//           } else {
//             nonSpam.push(complaint); // Add to non-spam list
//           }
//         });

//         setNonSpamComplaints(nonSpam); // Update the state with non-spam complaints
//       }
//     });

//     // Fetch spam messages from Spam_Messages table
//     const spamMessagesRef = ref(database, "Spam_Messages");

//     onValue(spamMessagesRef, (snapshot) => {
//       const spamData = snapshot.val();
//       if (spamData) {
//         const spamArray = Object.keys(spamData).map((key) => ({
//           id: key,
//           ...spamData[key],
//         }));
//         setSpamMessages(spamArray); // Update state with spam messages
//       }
//     });
//   }, [filter]);

//   return (
//     <div>
//       <h1>Complaints List (Filtered for Spam)</h1>
//       <ul>
//         {complaints.map((complaint) => (
//           <li key={complaint.id}>
//             <strong>ID:</strong> {complaint.id}, <strong>Description:</strong>{" "}
//             {complaint.description}
//           </li>
//         ))}
//       </ul>

//       <h1>Spam Messages</h1>
//       <ul>
//         {spamMessages.map((spam) => (
//           <li key={spam.id}>
//             <strong>ID:</strong> {spam.id}, <strong>Description:</strong>{" "}
//             {spam.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

// import React, { useEffect, useState } from "react";
// import { ref, onValue, update, set, remove } from "firebase/database";
// import { Filter } from "bad-words";
// import { database } from "./firebaseConfig"; // Import the initialized database

// const SpamChecker = () => {
//   const [complaints, setNonSpamComplaints] = useState([]); // Non-spam complaints
//   const [spamMessages, setSpamMessages] = useState([]); // Spam messages
//   const filter = new Filter(); // Create an instance of the Filter

//   useEffect(() => {
//     const complaintsRef = ref(database, "Add_Complaint");

//     const handleData = (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const complaintsArray = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));

//         const nonSpam = [];
//         const spamToMove = [];

//         // Check each complaint for spam
//         complaintsArray.forEach((complaint) => {
//           if (filter.isProfane(complaint.description)) {
//             const cleanDescription =
//               filter.clean(complaint.description) + " [Spam detected]";

//             spamToMove.push({
//               id: complaint.id,
//               description: cleanDescription,
//               ...complaint,
//             });

//             // Prepare to remove this complaint from Add_Complaint
//             remove(ref(database, `Add_Complaint/${complaint.id}`));
//           } else {
//             nonSpam.push(complaint); // Add to non-spam list
//           }
//         });

//         setNonSpamComplaints(nonSpam); // Update the state with non-spam complaints

//         // Move spam messages to Spam_Messages only if there are any to move
//         if (spamToMove.length > 0) {
//           spamToMove.forEach((spam) => {
//             set(ref(database, `Spam_Messages/${spam.id}`), spam);
//           });
//         }
//       }
//     };

//     // Attach listener to Add_Complaint
//     const complaintsListener = onValue(complaintsRef, handleData);

//     // Fetch spam messages
//     const spamMessagesRef = ref(database, "Spam_Messages");

//     const handleSpamData = (snapshot) => {
//       const spamData = snapshot.val();
//       if (spamData) {
//         const spamArray = Object.keys(spamData).map((key) => ({
//           id: key,
//           ...spamData[key],
//         }));
//         setSpamMessages(spamArray); // Update state with spam messages
//       }
//     };

//     const spamMessagesListener = onValue(spamMessagesRef, handleSpamData);

//     // Clean up the listeners on unmount
//     return () => {
//       complaintsListener();
//       spamMessagesListener();
//     };
//   }, []); // Empty dependency array ensures this effect runs only once

//   return (
//     <div>
//       <h1>Complaints List (Filtered for Spam)</h1>
//       <ul>
//         {complaints.map((complaint) => (
//           <li key={complaint.id}>
//             <strong>ID:</strong> {complaint.id}, <strong>Description:</strong>{" "}
//             {complaint.description}
//           </li>
//         ))}
//       </ul>

//       <h1>Spam Messages</h1>
//       <ul>
//         {spamMessages.map((spam) => (
//           <li key={spam.id}>
//             <strong>ID:</strong> {spam.id}, <strong>Description:</strong>{" "}
//             {spam.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

// import React, { useEffect, useState } from "react";
// import { ref, onValue, update, set, remove } from "firebase/database";
// import { Filter } from "bad-words";
// import { database } from "./firebaseConfig"; // Import the initialized database
// import "./SpamChecker.css"; // Import the CSS styles

// const SpamChecker = () => {
//   const [complaints, setNonSpamComplaints] = useState([]); // Non-spam complaints
//   const [spamMessages, setSpamMessages] = useState([]); // Spam messages
//   const filter = new Filter(); // Create an instance of the Filter

//   useEffect(() => {
//     const complaintsRef = ref(database, "Add_Complaint");

//     const handleData = (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const complaintsArray = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));

//         const nonSpam = [];
//         const spamToMove = [];

//         complaintsArray.forEach((complaint) => {
//           if (filter.isProfane(complaint.description)) {
//             const cleanDescription =
//               filter.clean(complaint.description) + " [Spam detected]";

//             spamToMove.push({
//               id: complaint.id,
//               description: cleanDescription,
//               ...complaint,
//             });

//             remove(ref(database, `Add_Complaint/${complaint.id}`));
//           } else {
//             nonSpam.push(complaint); // Add to non-spam list
//           }
//         });

//         setNonSpamComplaints(nonSpam);

//         if (spamToMove.length > 0) {
//           spamToMove.forEach((spam) => {
//             set(ref(database, `Spam_Messages/${spam.id}`), spam);
//           });
//         }
//       }
//     };

//     const complaintsListener = onValue(complaintsRef, handleData);

//     const spamMessagesRef = ref(database, "Spam_Messages");

//     const handleSpamData = (snapshot) => {
//       const spamData = snapshot.val();
//       if (spamData) {
//         const spamArray = Object.keys(spamData).map((key) => ({
//           id: key,
//           ...spamData[key],
//         }));
//         setSpamMessages(spamArray);
//       }
//     };

//     const spamMessagesListener = onValue(spamMessagesRef, handleSpamData);

//     return () => {
//       complaintsListener();
//       spamMessagesListener();
//     };
//   }, []);

//   return (
//     <div className="container">
//       <h1 className="header">Complaints List (Filtered for Spam)</h1>
//       <ul className="complaints-list">
//         {complaints.map((complaint) => (
//           <li className="complaint-item" key={complaint.id}>
//             <span className="complaint-id">ID: {complaint.id}</span>
//             <span className="complaint-desc">{complaint.description}</span>
//           </li>
//         ))}
//       </ul>

//       <h1 className="header">Spam Messages</h1>
//       <ul className="spam-list">
//         {spamMessages.map((spam) => (
//           <li className="spam-item" key={spam.id}>
//             <span className="spam-id">ID: {spam.id}</span>
//             <span className="spam-desc">{spam.description}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SpamChecker;

import React, { useEffect, useState } from "react";
import { ref, onValue, update, set, remove } from "firebase/database";
import { Filter } from "bad-words";
import { database } from "./firebaseConfig"; // Import the initialized database
import "./SpamChecker.css"; // Import the CSS styles

const SpamChecker = () => {
  const [complaints, setNonSpamComplaints] = useState([]); // Non-spam complaints
  const [spamMessages, setSpamMessages] = useState([]); // Spam messages
  const filter = new Filter(); // Create an instance of the Filter

  useEffect(() => {
    const complaintsRef = ref(database, "Add_Complaint");

    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const complaintsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const nonSpam = [];
        const spamToMove = [];

        complaintsArray.forEach((complaint) => {
          if (filter.isProfane(complaint.description)) {
            const cleanDescription =
              filter.clean(complaint.description) + " [Spam detected]";

            // Prepare spam message to move
            spamToMove.push({
              id: complaint.id,
              description: cleanDescription,
              ...complaint,
            });
          } else {
            nonSpam.push(complaint); // Add to non-spam list
          }
        });

        setNonSpamComplaints(nonSpam);

        // Process the spam messages
        if (spamToMove.length > 0) {
          spamToMove.forEach((spam) => {
            // Move the spam message to the Spam_Messages table
            set(ref(database, `Spam_Messages/${spam.id}`), spam)
              .then(() => {
                // After successfully moving the message, delete it from Add_Complaint
                remove(ref(database, `Add_Complaint/${spam.id}`));
              })
              .catch((error) => {
                console.error("Error moving spam message: ", error);
              });
          });
        }
      }
    };

    const complaintsListener = onValue(complaintsRef, handleData);

    const spamMessagesRef = ref(database, "Spam_Messages");

    const handleSpamData = (snapshot) => {
      const spamData = snapshot.val();
      if (spamData) {
        const spamArray = Object.keys(spamData).map((key) => ({
          id: key,
          ...spamData[key],
        }));
        setSpamMessages(spamArray);
      }
    };

    const spamMessagesListener = onValue(spamMessagesRef, handleSpamData);

    return () => {
      complaintsListener();
      spamMessagesListener();
    };
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <div className="container">
      <h1 className="header">Complaints List (Filtered for Spam)</h1>
      <ul className="complaints-list">
        {complaints.map((complaint) => (
          <li className="complaint-item" key={complaint.id}>
            <span className="complaint-id">ID: {complaint.id}</span>
            <span className="complaint-desc">{complaint.description}</span>
          </li>
        ))}
      </ul>

      <h1 className="header">Spam Messages</h1>
      <ul className="spam-list">
        {spamMessages.map((spam) => (
          <li className="spam-item" key={spam.id}>
            <span className="spam-id">ID: {spam.id}</span>
            <span className="spam-desc">{spam.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpamChecker;
