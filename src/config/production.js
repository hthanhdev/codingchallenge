
module.exports =  {
    rootUrl: process.env.ROOT_URL || 'https://production.tk',
    firebase: {
      key: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      prefix: process.env.FIREBASE_PREFIX || '',
      authFirestorePrefix: process.env.AUTH_FIRESTORE_PREFIX,
    }
  }
  