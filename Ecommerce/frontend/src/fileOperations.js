<<<<<<< HEAD:Ecommerce/frontend/src/fileOperations.js
/*var fs = require("fs");
=======

>>>>>>> origin/master:Ecommerce/fileOperations.js
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
	fs.readFile({"Testfile.txt": function (err, data) {
	}
,})
	if (err) {
		return console.error(err);
	}
<<<<<<< HEAD:Ecommerce/frontend/src/fileOperations.js
	console.log("Data read : " + data.toString());
	// delete the file
	fs.unlink("Testfile.txt", (err) => {
		if (err) {
			throw err;
		}
	
	console.log("Delete File successfully.");
	});
	});
}
);*/
=======
	console.log("Data read : " + data.toString()); {

	}
})
>>>>>>> origin/master:Ecommerce/fileOperations.js
