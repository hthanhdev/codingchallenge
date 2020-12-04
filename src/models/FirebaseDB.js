const moment = require('moment')
const config = require('../config')
const admin = require('../connections/firebase')



class FirebaseDB {
  constructor(collectionPath) {

    if (!this.firestore) {
      this.firestore = admin.getFirestore()
    }
    this.collectionName = collectionPath
    this.collection = this.firestore.collection(collectionPath)
  }

  async findOneByEmail(email){
    try {
        let rs = await this.findOne([['email','==',email]])
        if(!rs) return false;
        return rs
    } catch (error) {
        return error
    }
}
  getDocumentByPath(docPath) {
    try {
      return this.firestore.doc(docPath)
    } catch (error) {
      console.log(error, docPath, 'ERR on FirebaseDB::getDocumentByPath')
    }
  }

   _buildWhereQuery(query, wheres, options = {}) {
    if (wheres && wheres.length > 0) {
      wheres.forEach(where => {
        query = query.where(...where)
      })
    }

    if (options.orderBy) {
      const orderBy = options.orderBy
      // orderBy is array
      // citiesRef.orderBy("name", "desc").limit(3)
      query = query.orderBy(orderBy[0], orderBy[1]) // do not remove ...
    }

    if (options.offset) {
      query = query.offset(options.offset)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }
    if (options.startAt) {
      query = query.startAt(options.startAt)
    }

    if (options.endAt) {
      query = query.endAt(options.endAt)
    }
    return query
  }

	/*
	 * @return Promise which contains QuerySnapshot
	 */
  findByPath(collectionPath, wheres, options = {}) {
    collectionPath = this.prefixTbl + collectionPath

    let query = this.firestore.collection(collectionPath)

    query = this._buildWhereQuery(query, wheres, options)

    try {
      return query.get()
    } catch (error) {
      console.log(error, wheres, 'ERR on _BaseDbFireStore2::findByPath')
    }
  }

	/*
	 * @params wheres [ ['name', '==', 'thanh'], ['status', '>', 0] ]
	 * @return QuerySnapshot
	 */
  async find(wheres, options = {}) {
    let query = this.collection
   
    query = await this._buildWhereQuery(query, wheres, options)

    try {
      return query.get()
    } catch (error) {
      console.log(error, wheres, 'ERR on _BaseDbFireStore2::find')
    }

  }

  async findWhere(wheres, options) {
    // wheres.push(['isdel', '==', 0])

    let data = []
    let querySnapshot = await this.find(wheres, options)
    querySnapshot.forEach(documentSnapshot => {
      if (documentSnapshot.exists) {
        let dataSnap = documentSnapshot.data()
        dataSnap.id = documentSnapshot.id
        data.push(dataSnap)
      }
    })
    return data
  }

  async findOne(wheres, options = {}) {
    options.limit = 1
    let rs = await this.findWhere(wheres, options)
    if (rs) return rs[0]

    return {}
  }

  // DocumentReference
   async findOneById(id) {
    console.log('FirebaseDB::findOneById', `${this.collectionName}/${id}`)
    try {
      let doc = await this.collection.doc(id).get()
      if(doc.exists){
        return doc.data();
      } else {
        return false;
      }
      
    } catch (error) {
      console.log(error, id, 'ERR on _BaseDbFireStore2::findOneById')
    }
  }

  async create(id, data) {
    try {
      data.createdAt = moment().valueOf()
      data.updatedAt = moment().valueOf()
      return await this.collection.doc(id).set(data)
    } catch (error) {
      console.log(error, data, 'ERR on _BaseDbFireStore2::create')
    }
  }

  async update(id, data) {
    try {
      data.updatedAt = moment().valueOf()
      return await this.collection.doc(id).update(data)
    } catch (error) {
      console.log(error, data, id, 'ERR on _BaseDbFireStore2::update')
    }
  }

  async delete(id) {
    try {
      return await this.collection.doc(id).delete()
    } catch (error) {
      console.log(error, id, 'ERR on _BaseDbFireStore2::delete')
    }
  }



}

module.exports = FirebaseDB
