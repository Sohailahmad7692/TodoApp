//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose")

const app = express();

mongoose.connect('mongodb://localhost:27017/todolistdb', {useNewUrlParser: true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const listSchema={
  name:String
}
const Item=mongoose.model("Item",listSchema)
const Item1=new Item({
  name:"Sohail"
})
const Item2=new Item({
  name:"Shubham"
})
const Item3=new Item({
  name:"Anurag"
})
const defaultItem=[Item1,Item2,Item3]
const itemSchema={
  name:String,
  items:[listSchema]
}
const List=mongoose.model("List",itemSchema)

app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({},function(err,foundItem){
  if(foundItem.length===0){
    Item.insertMany(defaultItem,function(err){
      if(err){
        console.log(err)
      } else{
        console.log("sucessfully completed the project")
      }
    })
    res.redirect('/')
  } else{
    res.render("list", {listTitle: "Today", newListItems: foundItem});
  }
})
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName=req.body.list
  const item4=new Item({
    name:itemName
  })
  console.log(listName)
  if (listName==="Today"){
    item4.save()
    res.redirect('/')
  }
else{
  List.findOne({name:listName},function(err,foundItem){
    foundItem.items.push(item4)
    foundItem.save()
    res.redirect('/'+listName)
  })

}
});
app.post("/delete",function(req,res){
  const checkedId=req.body.checkbox
  Item.findByIdAndRemove(checkedId,function(err){
    if(err){
      console.log(err)
    }
    res.redirect('/')
  })
})
app.get('/:site',function(req,res){
  const varSite=req.params.site
  List.findOne({name:varSite},function(err,foundItem){
    console.log(foundItem)
    if(err){
      console.log(err)
    } else{
      if(!foundItem){
        const list=new List({
          name:varSite,
          items:defaultItem
        })
        list.save()
        res.redirect('/'+varSite)
      }
      else{
        
        res.render("list", {listTitle: foundItem.name, newListItems: foundItem.items});
        
      }
    }
  })
  
})
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
