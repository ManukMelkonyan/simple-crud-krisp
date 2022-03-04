const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "horse.jpg"), (err, data) => {
  if (err) {
    console.log(err);
  } else {
    fs.readFile(path.join(__dirname, "app", "receivedFiles", "horse.jpg"), (err, d) => {
      if (err) {
        console.log(err);
      } else {
        console.log(d);
        console.log(data.includes(d));
        console.log(d.includes(data));

        // console.log(data.toString() === d.toString());
      }
    });
  }
});
