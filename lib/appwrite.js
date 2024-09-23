import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const Config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.reactnativecrashcourse",
  projectId: "66f00b46002f63f44149",
  databaseId: "66f00df600310c53235d",
  userCollectionId: "66f00e310028208fb6ae",
  videoCollectionId: "66f00e6d0022ad9e2fc9",
  storageId: "66f0105e001f48ebaf08"
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(Config.endpoint)
  .setProject(Config.projectId)
  .setPlatform(Config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      Config.databaseId,
      Config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        user: username,
        avatar: avatarUrl
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}
