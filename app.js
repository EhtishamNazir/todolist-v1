const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
	name: String,
});

const Item = mongoose.model("Item", itemsSchema);

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

const listSchema = {
	name: String,
	items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

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

	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName
	});

	if (listName === "Today") {
		item.save();
		res.redirect("/");
	} else{
		List.findOne({name: listName}, function(err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
	}


	
		
});

app.post("/delete", (req, res) => {

	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkedItemId, function(err) {
			if (err) {
				console.log(err);
			} else{
				console.log("Item deleted successfully");
				res.redirect("/");
			}
		});
	} else{
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
			if (!err) {
				res.redirect("/" + listName);
			}
		});
	}

	
		
});

app.get("/:customListName", (req, res) => {

	const customListName = _.capitalize(req.params.customListName);

	List.findOne({name: customListName}, function(err, foundList) {
		if (!err) {
			if (!foundList) {
				// create new list
				const list = new List({
					name: customListName,
					items: defaultItems
				});

				list.save();
				res.redirect("/" + customListName);
			} else{
				// show list
				res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
			}
		} 
	});

});

app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
})