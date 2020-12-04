const admin = require('firebase-admin')
const config = require('../config')

class FirebaseAdmin {
  constructor() {
	console.log(config, "test")
    if(!this.admin) {
      const serviceAccount = require(config.firebase.key)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://coding-1212.firebaseio.com"

      })
      this.admin = admin
    }
  }

  getFirestore() {
    const Firestore = this.admin.firestore()
    return Firestore
  }


}

module.exports = new FirebaseAdmin()
