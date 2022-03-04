const fs = require("fs");
const path = require("path");

const fileName = "dog.jpg";

fs.readFile(path.join(__dirname, fileName), (err, data) => {
  if (err) {
    console.log(err);
  } else {
    fs.readFile(path.join(__dirname, "app", "receivedFiles", fileName), (err, d) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        console.log(d);
        console.log(data.length);
        console.log(d.length);
        let counter = 0;
        for (let i = 0; i < d.length; ++i) {
          if (d[i] !== data[i]) {
            counter++;
          }
        }

        console.log("dismatch: " + counter);

        // console.log(data.toString() === d.toString());
      }
    });
  }
});
