const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
	name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
	name: "Welcome to your todo list"
})
const item2 = new Item({
	name: "Hit the plus button to add item"
});
const item3 = new Item({
	name: "<-- Hit this to delete item"
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {

	Item.find({}, function(err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function(err) {
				if (err) {
					console.log(err);
				} else{
					console.log("Default Items added successfully!");
				}
			});
			res.redirect("/");
		} else{
			res.render("list", {listTitle: "Today", newListItems: foundItems});
		}
	})
	
});

app.post("/", (req, res) => {

	itemName = req.body.newItem;

	const item = new Item({
		name: itemName
	});

	item.save();

	res.redirect("/");
		
});

app.post("/delete", (req, res) => {

	const checkedItemId = req.body.checkbox;

	Item.findByIdAndRemove(checkedItemId, function(err) {
		if (err) {
			console.log(err);
		} else{
			console.log("Item deleted successfully");
			res.redirect("/");
		}
	});
		
});

app.get("/work", (req, res) => {
	res.render("list", {listTitle: "Work", newListItems: workItems});
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
})