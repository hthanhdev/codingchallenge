
module.exports =  {
    rootUrl: process.env.ROOT_URL || 'https://coding-1212.firebaseio.com',
    firebase: {
      key: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      prefix: process.env.FIREBASE_PREFIX || '',
      authFirestorePrefix: process.env.AUTH_FIRESTORE_PREFIX || 'dev_',
    }
  }
  