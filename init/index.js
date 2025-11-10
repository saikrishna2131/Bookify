const Listing = require("../models/listing.js");
const initData = require("./data.js");
const mongoose = require("mongoose");
main()
  .then(() => {
    console.log("connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6899defeb858da83a53b7809",
  }));
  await Listing.insertMany(initData.data);
  console.log("completly saved");
};
initDb();
