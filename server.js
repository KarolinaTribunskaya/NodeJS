const fs = require("fs")
const express = require("express")
let app = express()
const bodyParser = require('body-parser');
const zlib = require("zlib");
const path = require("path");

const file_path = path.basename("C:\\Users\\Karolina\\WebstormProjects\\project\\lib.json")
const store_path = path.basename("C:\\Users\\Karolina\\WebstormProjects\\project\\control_store.txt")

//clean all files
/*
let a = JSON.parse(fs.readFileSync("lib.json", "utf8"))
fs.writeFileSync("lib.json", "{\"books\":[],\"readers\":[]}")
let deflated1 = zlib.deflateSync("create library\n").toString('base64');
let f = fs.readFileSync(store_path, "utf8")
fs.writeFileSync(store_path, deflated1)
*/

app.get("/add_book", function (req, res) {
    res.end(fs.readFileSync("./add_book.html", "utf8"))
})
app.get("/main", function (req, res) {
    res.end(fs.readFileSync("./main.html", "utf8"))
})
app.get("/del_book", function (req, res) {
    res.end(fs.readFileSync("./del_book.html", "utf8"))
})
app.get("/add_reader", function (req, res) {
    res.end(fs.readFileSync("./add_reader.html", "utf8"))
})
app.get("/del_reader", function (req, res) {
    res.end(fs.readFileSync("./del_reader.html", "utf8"))
})
app.get("/give_book", function (req, res) {
    res.end(fs.readFileSync("./give_book.html", "utf8"))
})
app.get("/back_book", function (req, res) {
    res.end(fs.readFileSync("./back_book.html", "utf8"))
})

//Post methods
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/add_book", function (req, res) {
    let book = req.body
    book["status"] = true;
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    a.books.push(book)
    fs.writeFileSync(file_path, JSON.stringify(a))
    let b = a.books
    let input = fs.readFileSync(store_path, "utf8");
    let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
    inflated += "add book " + book.name + "\n";
    let deflated = zlib.deflateSync(inflated).toString('base64');
    fs.writeFileSync(store_path, deflated)
    res.send("Книга додана!")
    res.status(200)
})

app.post("/del_book", function (req, res){
    let content = req.body
    let book_id = content.id
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    let find_book  = a.books.find(book => book.id === book_id);
    let index = a.books.indexOf(find_book);
    a.books.splice(index, 1);
    fs.writeFileSync(file_path, JSON.stringify(a))
    let input = fs.readFileSync(store_path, "utf8");
    let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
    inflated += "del book " + book_id + "\n";
    let deflated = zlib.deflateSync(inflated).toString('base64');
    fs.writeFileSync(store_path, deflated)
    res.send("Книга видалена!")
    res.status(200)
})

app.post("/add_reader", function (req, res) {
    let reader = req.body
    console.log(reader)
    reader["books"] = []
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    a.readers.push(reader)
    fs.writeFileSync(file_path, JSON.stringify(a))
    let input = fs.readFileSync(store_path, "utf8");
    let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
    inflated += "add reader " + reader.surname + "\n";
    let deflated = zlib.deflateSync(inflated).toString('base64');
    fs.writeFileSync(store_path, deflated)
    res.send("Читач доданий!")
    res.status(200)
})

app.post("/del_reader", function (req, res){
    let content = req.body
    let reader_id = content.id
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    let find_reader  = a.readers.find(reader => reader.id === reader_id);
    let index = a.readers.indexOf(find_reader);
    a.readers.splice(index, 1);
    fs.writeFileSync(file_path, JSON.stringify(a))
    let input = fs.readFileSync(store_path, "utf8");
    let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
    inflated += "del reader " + reader_id + "\n";
    let deflated = zlib.deflateSync(inflated).toString('base64');
    fs.writeFileSync(store_path, deflated)
    res.send("Читач видалений!")
    res.status(200)
})

app.post("/give_book", function (req, res){
    let content = req.body
    let book_id = content.book_id
    let reader_id = content.reader_id
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    let find_reader = a.readers.find(reader => reader.id === reader_id);
    let find_book = a.books.find(book => book.id === book_id);
    let index_book = a.books.indexOf(find_book);
    let index_reader = a.readers.indexOf(find_reader);
    if(a.books[index_book].status){
        a.readers[index_reader].books.push(find_book);
        //console.log(this.books[index_book].status)
        a.books[index_book].status = false;
        fs.writeFileSync(file_path, JSON.stringify(a))
        let input = fs.readFileSync(store_path, "utf8");
        let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
        inflated += "give reader - " + reader_id + ", book - " + book_id + "\n";
        let deflated = zlib.deflateSync(inflated).toString('base64');
        fs.writeFileSync(store_path, deflated)
        res.send("Книгу видано!")
        res.status(200)
    }
})

app.post("/back_book", function (req, res) {
    let content = req.body
    let reader_id = content.reader_id
    let book_id = content.book_id
    let a = JSON.parse(fs.readFileSync(file_path, "utf8"))
    let find_reader = a.readers.find(reader => reader.id === reader_id);
    let find_book = a.books.find(book => book.id === book_id);
    let index_book = a.books.indexOf(find_book);
    let index_reader = a.readers.indexOf(find_reader);
    if(!a.books[index_book].status){
        let index_book_in_reader = a.readers[index_reader].books.indexOf(find_book)
        a.readers[index_reader].books.splice(index_book_in_reader, 1);
        //console.log(this.books[index_book].status)
        a.books[index_book].status = true;
        fs.writeFileSync(file_path, JSON.stringify(a))
        fs.writeFileSync(file_path, JSON.stringify(a))
        let input = fs.readFileSync(store_path, "utf8");
        let inflated = zlib.inflateSync(new Buffer(input, 'base64')).toString();
        inflated += "reader - " + reader_id + " back book - " + book_id + "\n";
        let deflated = zlib.deflateSync(inflated).toString('base64');
        fs.writeFileSync(store_path, deflated)
        res.send("Книгa повернена!")
        res.status(200)
    }

})

app.listen(3000)