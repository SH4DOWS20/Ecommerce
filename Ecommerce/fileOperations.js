var fs = require("fs");
console.log(" Writing into an file ");

// Testfile.txt is an empty file
fs.writeFile(
"Testfile.txt",
"Welcome to Icedog",
function (err) {
	if (err) {
	return console.error(err);
	}

	// If no error the remaining code executes
	console.log(" Finished writing ");
	console.log("Reading the data that's written");

	// Reading the file
	fs.readFile("Testfile.txt", function (err, data) {
	if (err) {
		return console.error(err);
	}
	console.log("Data read : " + data.toString());
		
	});
}
);