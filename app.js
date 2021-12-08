const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
	let today = new Date();

	let options = {
		weekday: "long",
		day: "numeric",
		month: "long"
	}

	day = today.toLocaleDateString("en-us", options);

	res.render("list", {kindOfDay: day, newListItems: items});
	
});

app.post("/", (req, res) => {
	item = req.body.newItem;

	items.push(item);

	res.redirect("/");	
});


app.listen(3000, () => {
	console.log("Server started on port 3000");
})