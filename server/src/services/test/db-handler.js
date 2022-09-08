import mongoose from "../mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connect = async (name) => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    console.log("mms uri", uri);
    const config = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      dbName: name,
    };
    const inst = await mongoose.connect(uri, config);
    // console.log("connection instance", inst);
    return mongod;
  } catch (err) {
    console.log(err);
  }
};

export const clearDb = async (memServerInst) => {
  if (memServerInst) {
    const collections = Object.keys(mongoose.connection.collections);
    console.log("These are the collections", collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      try {
        await collection.drop();
      } catch (err) {
        if (err.message === "ns not found") {
          return;
        }
        if (
          err.message.includes("a background operation is currently running")
        ) {
          return;
        }
        console.log(err.message);
      }
    }
  }
};

// export const clearDb = async (memServerInst) => {
//   try {
//     if (memServerInst) {
//       const collections = mongoose.connection.collections;
//       console.log("Logging collections", Object.keys(collections));
//       for (const key in collections) {
//         await collections[key].drop();
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

export const disconnect = async (memServerInst) => {
  try {
    if (memServerInst) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await memServerInst.stop();
    }
  } catch (err) {
    console.log(err);
  }
};
