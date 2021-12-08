const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", (req, res) => {
	var today = new Date();
	var currentDay = today.getDay();

	if (currentDay === 6 || currentDay === 0) {
		res.send("Yay It's weekend!");
	} else{
		res.send("Boo! I have to work today");
	}
	
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
})