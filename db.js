function init(mongoose) {

  // DB conntection
  const DB_URI = `mongodb+srv://zyandeep:${process.env.DB_PASSWORD}@test-cluster-xxn7o.mongodb.net/myTestDB?retryWrites=true&w=majority`

  mongoose.connect(DB_URI,
    {
      useNewUrlParser: true,
      dbName: "myTestDB",
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log("[mongoose]: DB connected!");
    })
    .catch(err => {
      console.log("[mongoose]: ", err);
    });
}

module.exports = init;
