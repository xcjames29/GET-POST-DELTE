const http = require("http");
const port = 8111;
const fs = require("fs");
let called = false;
let user = [
  {
    "id": "1",
    "createdAt": "2021-05-31T10:59:02.663Z",
    "name": "Don Hessel",
    "avatar": "https://cdn.fakercloud.com/avatars/id835559_128.jpg"
  },
  {
    "id": "2",
    "createdAt": "2021-06-01T02:09:32.743Z",
    "name": "Rudy McLaughlin",
    "avatar": "https://cdn.fakercloud.com/avatars/naitanamoreno_128.jpg"
  },
  {
    "id": "3",
    "createdAt": "2021-05-31T07:10:14.018Z",
    "name": "Dianne Beier",
    "avatar": "https://cdn.fakercloud.com/avatars/theonlyzeke_128.jpg"
  },
  {
    "id": "4",
    "createdAt": "2021-05-31T23:52:35.521Z",
    "name": "Natasha Schaden",
    "avatar": "https://cdn.fakercloud.com/avatars/uxward_128.jpg"
  },
  {
    "id": "5",
    "createdAt": "2021-05-31T11:55:49.052Z",
    "name": "Debbie Russel MD",
    "avatar": "https://cdn.fakercloud.com/avatars/malgordon_128.jpg"
  },
  {
    "id": "6",
    "createdAt": "2021-05-31T16:23:08.597Z",
    "name": "Gloria Douglas",
    "avatar": "https://cdn.fakercloud.com/avatars/marcobarbosa_128.jpg"
  }
]
const server = http.createServer((req, res) => {

  let counter = fs.readFileSync("./data.txt", "utf8");
  let css = fs.readFileSync("./views/style.css");
  let js = fs.readFileSync("./views/main.js", "utf8");
  let newJs = "var data=" + counter + ";" + js;
  let data = "";
  console.log(req.method)
  if (req.method === "GET") {
    switch (req.url) {
      case "/style.css":
        res.writeHead(200, { "Content-type": "text/css" })
        res.end(css);
        break;
      case "/main.js":
        res.writeHead(200, { "Content-type": "text/javascript" })
        res.end(newJs);
        break;
      case "/users":
        res.writeHead(200, { "Content-type": "json" })
        res.write(JSON.stringify(user))
        res.end()
      default: {
        if (req.url === "/") data = "index.html"
        else if (req.url === "/about") data = "about.html"
        else if (req.url === "/contact") data = "contact.html"
        else data = "404.html"
        fs.readFile("./views/" + data, (err, page) => {
          if (err) {
            console.log(err)
            res.end();
          }
          res.writeHead(200, "Content-type", "text/html");
          res.write(page);
          res.end();
          if (!called) {
            called = !called;
            fs.writeFileSync("./data.txt", JSON.stringify(parseInt(counter) + 1));
          }
          else called = !called;
        })
      }
    }
  }
  else if(req.method==="DELETE"){
    if (req.url === "/users") {
      console.log(req.headers);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      })
      req.on("end", () => {
        if(JSON.parse(body).id){
          
          user = user.reduce((acc,val)=>{
              if(val.id !== JSON.parse(body).id){
                acc.push(val)
              }
              return acc
          },[])
          res.writeHead(200, { "Content-type": "json" })
          res.write(JSON.stringify("User Successfully Deleted"))
          res.write(JSON.stringify(user))
          res.end();
        }
        else{
          res.writeHead(400, { "Content-type": "json" })
          res.write(JSON.stringify("Invalid Deletion! Must Send ID!"))
          res.end();
        }
      
      })
    }
  }
  else {
    if (req.url === "/users") {
      console.log(req.headers);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      })
      req.on("end", () => {
        if(JSON.parse(body).name && JSON.parse(body).avatar){
          let newObj = {
            id: (user.length+1).toString(),
            createdAt: new Date,
            name: JSON.parse(body).name,
            avatar: JSON.parse(body).avatar
          }
          user.push(newObj);
          res.writeHead(200, { "Content-type": "json" })
          res.write(JSON.stringify("User Successfully Added"))
          res.write(JSON.stringify(user))
          res.end();
        }
        else{
          res.writeHead(400, { "Content-type": "json" })
          res.write(JSON.stringify("Invalid Data"))
          res.end();
        }
      })
      
    }
  }
  console.log("Request received");
  console.log(req.method, req.url);
});

server.listen(port, "localhost", () => {
  console.log("Server is listening to " + port);
  fs.writeFileSync("./data.txt", "0");
})

