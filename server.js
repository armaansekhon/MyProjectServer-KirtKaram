const express=require("express");
const app = express(); //it runs object
const fileuploader = require("express-fileupload");
const mysql2 = require("mysql2");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());

app.listen(3002, function () {
  console.log("balle balle server started at port 3002");
});

const configobj = {
  host: "127.0.0.1",
  user: "root",
  password: "#Arman@1234",
  database: "user",
};
const mysql = mysql2.createConnection(configobj);
mysql.connect(function (
  err // it will recieve error object from node server
) {
  if (err == null) {
    console.log("Connected Successfully to Database");
  } else {
    console.log(err.message);
  }
});
// users-table emailid pass utype DOS status
app.get("/profile-save", function (req, resp) {
  mysql.query(
    "insert into users values(?,?,?,current_date(),1)",
    [req.query.kuchEmail, req.query.passKuch, req.query.utypeKuch],
    function (err) {
      if (err == null) resp.send("Status:Signed-up successfully");
      else resp.send(err.message);
      return;
    }
  );
});
app.get("/check-email", function (req, resp) {
  mysql.query(
    "select * from users where emailid=?",
    [req.query.kuchEmail],
    function (err, resultJsonary) {
      if (resultJsonary.length == 1) resp.send(" Email not available");
      else resp.send("Email available");
    }
  );
});
app.get("/check-login", function (req, resp) {
  mysql.query(
    "select * from users where emailid=? and pass=?",
    [req.query.Email, req.query.pass],
    function (err, resultJsonary) {

      if(resultJsonary[0].status==1) {
        resp.send(resultJsonary[0].utype)
      }
       else if (resultJsonary[0].status==0) 
       {
          resp.send("User blocked Contact Admin");}
       else{
        resp.send(err.message);
       } 
    }
  );
});

app.get("/customerprofile", function (err, resp) {
  let filepath = process.cwd() + "/public/profile-cust.html";
  resp.sendFile(filepath);
});

app.get("/workerprofile", function (err, resp) {
  let filepath = process.cwd() + "/public/profile-work.html";
  resp.sendFile(filepath);
});
app.get("/cdash", function (err, resp) {
  let filepath = process.cwd() + "/public/Customer-dash.html";
  resp.sendFile(filepath);
});
app.get("/adash", function (err, resp) {
  let filepath = process.cwd() + "/public/admin-dash.html";
  resp.sendFile(filepath);
});
app.get("/wdash", function (err, resp) {
  let filepath = process.cwd() + "/public/worker-dash.html";
  resp.sendFile(filepath);
});
app.get("/usermanager", function (err, resp) {
  let filepath = process.cwd() + "/public/usermanager.html";
  resp.sendFile(filepath);
});
app.get("/userview", function (err, resp) {
  let filepath = process.cwd() + "/public/userviewer.html";
  resp.sendFile(filepath);
});
app.get("/jobmanager", function (err, resp) {
    let filepath = process.cwd() + "/public/jobmanager.html";
    resp.sendFile(filepath);
  });
app.get("/findpro", function (err, resp) {
    let filepath = process.cwd() + "/public/findprovider.html";
    resp.sendFile(filepath);
  });-
  app.get("/findjob", function (err, resp) {
    let filepath = process.cwd() + "/public/jobfinder.html";
    resp.sendFile(filepath);
  });
app.post("/profile-save", function (req, resp) {
  console.log(req.body);
  
  // console.log(req.body);
  console.log(req.files);
  const email = req.body.mail;
  const name = req.body.name1;
  const cont = req.body.contact;
  const ad = req.body.address;
  const city = req.body.inputCity;
  const state = req.body.inputState;
  // let filename="nopic.png"    ;
  let filename;

  if (req.files == null) {
    filename = "nopic.png";
  } else {
    filename = req.files.ppic.name;
    let path = process.cwd() + "/public/uploads/" + filename;
    req.files.ppic.mv(path);
  }
  req.files.ppic = filename;
  console.log("connected");
  console.log(filename);
  req.body.ppic = filename;
  mysql.query(
    "insert into custprofile values(?,?,?,?,?,?,?)",
    [email, name, cont, ad, city, state, filename],
    function (err) {
      if (err == null) resp.send("record saved successfully");
      else resp.send(err.message);
      return;
    }
  );
});
// create table custprofile(emailid varchar(25) primary key, Cname varchar (20), Cno varchar (12), addr varchar (50), city varchar(15) ,state varchar(15),pic varchar(20));
app.post("/profile-update", function (req, resp) {
  // console.log(req.body);
  // console.log(req.body);
  // console.log(req.files);
  const email = req.body.mail;
  const name = req.body.name1;
  const cont = req.body.contact;
  const ad = req.body.address;
  const city = req.body.inputCity;
  const state = req.body.inputState;
  // let filename="nopic.png"    ;

  let filename;
  if (req.files == null) {
    filename = req.body.hdn;
  } else {
    filename = req.files.ppic.name;
    let path = process.cwd() + "/public/uploads/" + filename;
    req.files.ppic.mv(path);
  }
  req.files.ppic = filename;
  //  console.log("connected");
  //  console.log(filename);
  req.body.ppic = filename;
  mysql.query(
    "update custprofile set Cname=?,Cno=?,addr=?,city=?,state=?,pic=? where emailid=?",
    [name, cont, ad, city, state, filename, email],
    function (err) {
      if (err == null) resp.send("record updated successfully");
      else resp.send(err.message);
      return;
    }
  );
});
app.get("/profile-fetch", function (req, resp) {
  mysql.query(
    "select * from custprofile where emailid=?",
    [req.query.koiemail],
    function (err, resultJsonAry) {
      resp.send(resultJsonAry);
    }
  );
});
// create table tasks(rid int primary key auto_increment , email varchar (30), category varchar (30), address varchar (30),city varchar (30),upto date, task varchar (250) );
app.get("/posttask", function (req, resp) {
  // const email=req.query.mail;
  // const cat=req.query.tasktype;
  // const add=req.query.address;
  // const city=req.query.city;
  // const upto=req.query.uptodate;
  // const task=req.query.what;
  console.log("connected");
  console.log(req.query);
  mysql.query(
    "insert into tasks (email,category,address,city,upto,task) values (?,?,?,?,?,?)",
    [
      req.query.pemail,
      req.query.pwork,
      req.query.padd,
      req.query.pcity,
      req.query.pupto,
      req.query.what,
    ],
    function (err) {
      if (err == null) resp.send("record saved successfully");
      else resp.send(err.message);
      return;
    }
  );
});
app.get("/homefetch", function (req, resp) {
  mysql.query(
    "select * from tasks where email=?",
    [req.query.rademail],
    function (err, resultJsonAry) {
      resp.send(resultJsonAry);
    }
  );
});
// users-table emailid pass utype DOS status
app.get("/changepass", function (req, resp) {
  const mail = req.query.mail;
  const opass = req.query.op;
  const npas = req.query.np;
  mysql.query(
    "select *  from users  where emailid=? and pass=? ",
    [mail, opass],
    function (err, Ary) {
      if (Ary.length == 1) {
        mysql.query(
          "update users set pass=? where emailid=?",
          [npas, mail],
          function (err, result) {
            if (err == null) {
              resp.send("Pass changed succesfully");
            } else resp.send(err.message);
          }
        );
      } else resp.send("not valid");
    }
  );
});
// ..........workerprofile...........

app.post("/workprofile-save", function (req, resp) {
  console.log(req.body);
  // console.log(req.body);
  console.log(req.files);
  const email = req.body.eemail;
  const name = req.body.wname;
  const cont = req.body.wcon;
  const cat = req.body.wcat;
  const gen = req.body.wgen;
  const web = req.body.wweb;
  const firm = req.body.wfirm;
  const loc = req.body.wloc;
  const since = req.body.wsince;
  const work = req.body.wwhat;

  // let filename="nopic.png"    ;
  let filename;

  if (req.files == null) {
    filename = "nopic.png";
  } else {
    filename = req.files.ppic.name;
    let path = process.cwd() + "/public/uploads/" + filename;
    req.files.ppic.mv(path);
  }
  req.files.ppic = filename;
  console.log("connected");
  console.log(filename);
  // req.body.ppic=filename;
  mysql.query(
    "insert into workprofile values(?,?,?,?,?,?,?,?,?,?,?)",
    [email, name, cont, gen, cat, firm, web, loc, since, filename, work],
    function (err) {
      if (err == null) resp.send("record saved successfully");
      else resp.send(err.message);
      return;
    }
  );
});
// create table workprofile(mail varchar(25) primary key , name varchar(20),contact varchar(12),gender varchar(10),category varchar (20),firm varchar(30),website varchar(40),location varchar(40),since int,proof varchar(30),info varchar (150));
app.post("/workupdate", function (req, resp) {
  console.log(req.body);
  // console.log(req.body);
  console.log(req.files);
  const email = req.body.eemail;
  const name = req.body.wname;
  const cont = req.body.wcon;
  const cat = req.body.wcat;
  const gen = req.body.wgen;
  const web = req.body.wweb;
  const firm = req.body.wfirm;
  const loc = req.body.wloc;
  const since = req.body.wsince;
  const work = req.body.wwhat;

  // let filename="nopic.png"    ;
  let filename;

  if (req.files == null) {
    filename = "nopic.png";
  } else {
    filename = req.files.ppic.name;
    let path = process.cwd() + "/public/uploads/" + filename;
    req.files.ppic.mv(path);
  }
  req.files.ppic = filename;
  console.log("connected");
  console.log(filename);
  // req.body.ppic=filename;
  mysql.query(
    "update workprofile set name=?,contact=?,gender=?,category=?,firm=?,website=?,location=?,since=?,proof=?,info=? where mail=?"[
      (name, cont, gen, cat, firm, web, loc, since, filename, work, email)
    ],
    function (err) {
      if (err == null) resp.send("record updated successfully");
      else resp.send(err.message);
      return;
    }
  );
});
app.get("/workprofilefetch", function (req, resp) {
  mysql.query(
    "select * from workprofile where mail=?",
    [req.query.koiemail],
    function (err, resultJsonAry) {
      resp.send(resultJsonAry);
    }
  );
});
app.get("/angular-fetch-all", function (req, resp) {
  mysql.query("select * from users", function (err, resultJsonAry) {
    resp.send(resultJsonAry);
  });
});
app.get("/angular-block", function (req, resp) {
  const email = req.query.emailkuch;
  mysql.query(
    "update users set status=0 where emailid=?",
    [email],
    function (err, result) {
      if (err == null) {
        if (result.affectedRows == 1) resp.send("User Blocked Succesfully");
        else resp.send("Inavlid ID");
      } else resp.send(err.message);
    }
  );
});
app.get("/angular-resume", function (req, resp) {
  const email = req.query.emailkuch;
  mysql.query(
    "update users set status=1 where emailid=?",
    [email],
    function (err, result) {
      if (err == null) {
        if (result.affectedRows == 1) resp.send("User Resumed Succesfully");
        else resp.send("Inavlid ID");
      } else resp.send(err.message);
    }
  );
});
app.get("/angular-delete", function (req, resp) {
    const email = req.query.emailkuch;
    mysql.query(
      "delete from users  where emailid=?",
      [email],
      function (err, result) {
        if (err == null) {
          if (result.affectedRows == 1) resp.send("User Deleted Succesfully");
          else resp.send("Inavlid ID");
        } else resp.send(err.message);
      }
    );
  });
  app.get("/angular-delete-job", function (req, resp) {
    const rid = req.query.idkuch;
    mysql.query(
      "delete from tasks  where rid=?",
      [rid],
      function (err, result) {
        if (err == null) {
          if (result.affectedRows == 1) resp.send("Task Deleted Succesfully");
          else resp.send("Inavlid ID");
        } else resp.send(err.message);
      }
    );
  });
  app.get("/angular-fetch-all-jobs", function (req, resp) {
    mysql.query("select * from tasks where email=?",[ req.query.emailkuch], function (err, resultJsonAry) {
      resp.send(resultJsonAry);
    });
  });


  app.get("/angular-fetch-distinct-locs",function(req,resp){
    mysql.query("select distinct location from workprofile",function(err,resultJsonAry){
      if(err==null){
        resp.send(resultJsonAry);

      }
      else{
        resp.send(err.message)
      }
            
    })
})
app.get("/angular-fetch-distinct-cat",function(req,resp){
  mysql.query("select distinct category from workprofile where location=?",[req.query.kuchloc],function(err,resultJsonAry){
    if(err==null){
      resp.send(resultJsonAry);

    }
    else{
      resp.send(err.message)
    }
          
         
  })
  
})
app.get("/angular-fetch-catrec", function (req, resp) {
  mysql.query("select * from workprofile where category=? and location=?",[req.query.kuchcat,req.query.kuchloc] ,function (err, resultJsonAry) {
    resp.send(resultJsonAry);
  });
});
app.get("/angular-fetch-all-pro", function (req, resp) {
  mysql.query("select * from workprofile ", function (err, resultJsonAry) {
    resp.send(resultJsonAry);
  });
});
app.get("/angular-fetch-distinct-city",function(req,resp){
  mysql.query("select distinct city from tasks",function(err,resultJsonAry){
    if(err==null){
      resp.send(resultJsonAry);

    }
    else{
      resp.send(err.message)
    }
          
  })
})
app.get("/angular-fetch-distinct-job-cat",function(req,resp){
  mysql.query("select distinct category from tasks where city=?",[req.query.kuchcity],function(err,resultJsonAry){
    if(err==null){
      resp.send(resultJsonAry);

    }
    else{
      resp.send(err.message)
    }
          
         
  })
  
})
app.get("/angular-fetch-jobcatrec", function (req, resp) {
  mysql.query("select * from tasks where category=? and city=?",[req.query.kuchcat,req.query.kuchcity] ,function (err, resultJsonAry) {
    resp.send(resultJsonAry);
  });
});
app.get("/changepassjob", function (req, resp) {
  const mail = req.query.mail;
  const opass = req.query.op;
  const npas = req.query.np;
  mysql.query(
    "select *  from users  where emailid=? and pass=? ",
    [mail, opass],
    function (err, Ary) {
      if (Ary.length == 1) {
        mysql.query(
          "update users set pass=? where emailid=?",
          [npas, mail],
          function (err, result) {
            if (err == null) {
              resp.send("Pass changed succesfully");
            } else resp.send(err.message);
          }
        );
      } else resp.send("not valid");
    }
  );
});



