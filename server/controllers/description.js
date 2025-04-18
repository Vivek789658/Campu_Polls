const { MongoClient } = require('mongodb');

async function fetchDataFromSpecificCollection() {
  // Replace this with your MongoDB Atlas connection string
  const uri = process.env.DB_LINK;
  const descriptions = [];

  // MongoDB client
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB Atlas cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db("test");
    const collection = database.collection("feedbackforms");

    // Fetch all documents from the collection
    const data = await collection.find({}).toArray();

    // Loop over each document in the collection
    data.forEach((doc) => {
      // Loop through each question inside the questions array
      doc.questions.forEach((question) => {
        descriptions.push(question.description);
      });
    });

    // Log each description separately
    descriptions.forEach((desc) => {
      console.log(`${desc}`);
    });

    // Store descriptions in local storage (this part is for browser environment)
    if (typeof window !== 'undefined') {
      localStorage.setItem('descriptions', JSON.stringify(descriptions));
    }

    // Create div elements dynamically and append the descriptions
    const x = document.createElement('div');
    for (let i = 0; i < descriptions.length; i++) {
      const column = document.createElement('div');
      column.className = 'column';
      column.style.width = '200px';
      column.style.backgroundColor = 'lightblue';

      const content = document.createTextNode(descriptions[i]);
      column.appendChild(content);
      x.appendChild(column);
    }

    document.body.appendChild(x);  // Append the div to the body

    // You can also return the data for further processing
    return data;

  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Execute the function
fetchDataFromSpecificCollection().then(data => {
  // Perform actions with the data if necessary
});
