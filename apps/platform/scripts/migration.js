const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Function to migrate data
async function migrateData(
  sourceClient,
  targetClient,
  collectionName,
  sourceDB,
  targetDB
) {
  const sourceCollection = sourceClient.db(sourceDB).collection(collectionName);
  const targetCollection = targetClient.db(targetDB).collection(collectionName);

  const documents = await sourceCollection.find().toArray();

  if (documents.length > 0) {
    await targetCollection.insertMany(documents);
    console.log(
      `Data migrated from ${sourceDB}.${collectionName} to ${targetDB}.${collectionName}, total of ${documents.length} documents`
    );
  } else {
    console.log(`No documents found in ${sourceDB}.${collectionName}`);
  }

  sourceClient.close();
  targetClient.close();
}
async function initialize(sourceDB, targetDB) {
  const sourceClient = await MongoClient.connect(
    `${MONGODB_URI} + "?retryWrites=true&w=majority&appName=nith"`,
    {
      dbName: sourceDB,
    }
  );
  const targetClient = await MongoClient.connect(
    `${MONGODB_URI} + "?retryWrites=true&w=majority&appName=nith"`,
    {
      dbName: targetDB,
    }
  );

  console.log("Connected to source and target databases");

  const collections = await sourceClient.db(sourceDB).collections();

  console.log("Collections found in source database : ", collections.length);

  for await (const collection of collections) {
    console.log(collection.collectionName);
    await migrateData(
      sourceClient,
      targetClient,
      collection.collectionName,
      sourceDB,
      targetDB
    );
  }

  sourceClient.close();
  targetClient.close();
}
// initialize('main', 'production');
