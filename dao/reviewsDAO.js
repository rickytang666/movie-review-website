import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews
let isConnected = false

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db("reviews").collection("reviews")
      isConnected = true
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(movieId, user, review) {
    if (!isConnected) {
      return { error: "Database not connected" }
    }
    try {
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: review,
      }
      console.log("adding")
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    if (!isConnected) {
      return { error: "Database not connected" }
    }
    try {
      return await reviews.findOne({ _id: new ObjectId(reviewId) })
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

  static async updateReview(reviewId, user, review) {
    if (!isConnected) {
      return { error: "Database not connected" }
    }
    try {
      const updateResponse = await reviews.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { user: user, review: review } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId) {
    if (!isConnected) {
      return { error: "Database not connected" }
    }
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsByMovieId(movieId) {
    if (!isConnected) {
      return []
    }
    try {
      const cursor = await reviews.find({ movieId: parseInt(movieId) })
      return cursor.toArray()
    } catch (e) {
      console.error(`Unable to get review: ${e}`)
      return { error: e }
    }
  }

}