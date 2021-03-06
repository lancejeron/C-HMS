var express = require('express');
var flog = require( '../login/loggedin');
var router = express.Router();

//Request Add Page
function render(req,res){
  if(req.valid==1)
  res.render('request_add/views/index',{usertab: req.user, listtab: req.list});
  else if(req.valid==0)
  res.render('admin/views/invalidpages/normalonly');
  else
  res.render('login/views/invalid');
}
function findlist(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblfinalrequest WHERE intRequest_ClientID=?",[req.session.user], function (err, results) {
      if (err) return res.send(err);
      if (!results[0])
      // results[0].date= results[0].datRequestDate.toDateString("en-US").slice(4, 15);
      console.log('');
      req.list = results;
      return next();
    });
  }
router.get('/', flog, findlist, render);

//Create a List page
function rendercreatelist_services(req,res){
  if(req.valid==1)
  res.render('request_add/views/createlist_services',{usertab: req.user});
  else if(req.valid==0)
  res.render('admin/views/invalidpages/normalonly');
  else
  res.render('login/views/invalid');
}
router.get('/createlist_services', flog, rendercreatelist_services);

router.post('/createlist_services/createlist', flog, (req, res) => {
  var db = require('../../lib/database')();
  db.query(`INSERT INTO tblfinalrequest (intRequest_ClientID, strRequestType,strRequestName, strRequestDesc, datRequestDate, strRequestStatus)  VALUES ("${req.session.user}", "Add", "${req.body.reqname}", "${req.body.reqdesc}", "${req.body.reqdate}", "Draft")`, (err) => {
    if (err) console.log(err);
      res.redirect('/request_add');
    });
  });


// My list Page
function rendermylist(req,res){
    if(req.valid==1)
      res.render('request_add/views/mylist',{usertab: req.user, itemtab: req.item, listtab: req.list, counttab:req.count, servicetab: req.service, skilltab: req.skill, hwtab: req.hw});
    else if(req.valid==0)
      res.render('admin/views/invalidpages/normalonly');
    else
      res.render('login/views/invalid');
  }
function findcreatedlist(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblfinalrequest WHERE intRequestID=? AND intRequest_ClientID=?",[req.params.userid, req.session.user], function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.list = results;
    return next();
  });
}
  function findcreateditem(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblinitialrequest INNER JOIN tblMservice ON intITypeOfService = intID WHERE intIRequestID=?",[req.params.userid], function (err, results) {
      if (err) return res.send(err);
      if (!results[0])
      console.log('');
      req.item = results;
      return next();
    });
  }
  function findcountcreateditem(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT COUNT(intIRequestID) AS count FROM tblinitialrequest WHERE intIRequestID=?",[req.params.userid], function (err, results) {
      if (err) return res.send(err);
      if (!results[0])
      console.log('');
      req.count= results;
      return next();
    });
  }
  function findskills(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblmskills", function (err, results) {
      if (err) return res.send(err);
      if (!results[0])
      console.log('');
      req.skill= results;
      return next();
    });
  }
  router.get('/mylist_:userid', flog, findcreatedlist, findcreateditem, findcountcreateditem, findmservice, findskills, findresult, rendermylist);


// Add service to list
function rendercreatelist_set_preferences(req,res){
      if(req.valid==1)
        res.render('request_add/views/createlist_set_preferences',{usertab: req.user, servicetab: req.service, listtab: req.list});
      else if(req.valid==0)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
function findmservice(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblmservice ", function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.service = results;
    return next();
  });
}
router.get('/createlist_set_preferences_:userid', flog, findcreatedlist, findmservice, rendercreatelist_set_preferences);

router.post('/add_to_mylist_:userid',(req,res) =>{
  var db = require('../../lib/database')();
  var db2 = require('../../lib/database')();
  db.query(`SELECT COUNT (intIRequestID) AS Num FROM tblinitialrequest WHERE intIRequestID = ?`, [req.params.userid], function(err,results) {
    if (err) console.log(err);
    db2.query(`INSERT INTO tblinitialrequest VALUES ("${req.params.userid}", "${results[0].Num + 1}", "${req.body.service}", "${req.body.quantity}", "${req.body.age1}", "${req.body.age2}", "${req.body.gender}", "${req.body.educ}", "${req.body.workexp}")`, function(err){
      if (err) console.log(err);
      res.redirect('/request_add/mylist_'+req.params.userid, flog, findcreatedlist, findcreateditem, rendermylist);
    })
  })
});


//------------------------------------------submit list to admin
function submitrequest(req,res){
  var db = require('../../lib/database')();
  var sql = "UPDATE tblfinalrequest SET strRequestStatus= 'On process' WHERE intRequestID = ?";
  db.query(sql,[req.params.requestid],function (err) {
    if (err) return res.send(err);
    res.redirect('/request_add');
  });
}
router.get('/submit_request_:requestid',flog,submitrequest);

//----------------------------------------------------------------------------RESULTS SENT BY ADMIN
function findresult(req,res,next){
  var db = require('../../lib/database')();
  db.query(`SELECT strName, strFName, strLName, strGender, strPicture, strRClientStatus, intRHWID, intRRequestID, intRRequest_No, intRHWID, TIMESTAMPDIFF(YEAR,datBirthDay,CURDATE()) AS age FROM tblresults AS a INNER JOIN tbluser AS b ON a.intRHWID = b.intID INNER JOIN tblhouseholdworker AS c ON b.intID=c.intHWID INNER JOIN tblmservice AS d ON d.intID = c.intServiceID
              WHERE strRHWStatus = 'Approved' AND strRClientStatus IN ('Waiting', 'Approved', 'Rejected') AND intRRequestID = ?`,[req.params.userid], function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('xxxxxxxxxxxxxxxxxxxx'+req.params.requestid);
    req.hw= results;
    return next();
  });
}
// ---------------------------------------------------------------------------DECISION MADE BY CLIENT
function clientdecision(req,res){
  var db = require('../../lib/database')();
  if(req.body.btn1 == 'approve'){
    db.query(`UPDATE tblresults SET strRClientStatus= 'Approved' WHERE strRClientStatus='Waiting' AND intRRequestID = '${req.body.transid}' AND intRRequest_No = '${req.params.requestno}' AND intRHWID = '${req.body.hwid}'`,function (err) {
      console.log('xxxxxxxxxxxxxx'+err);
      res.redirect('/request_add/mylist_'+req.body.transid, flog, findcreatedlist, findcreateditem, findcountcreateditem, findmservice, findskills, findresult, rendermylist);
    })
  }
  else if(req.body.btn1 == 'reject'){
    db.query(`UPDATE tblresults SET strRClientStatus= 'Rejected' WHERE strRClientStatus='Waiting' AND intRRequestID = '${req.body.transid}' AND intRRequest_No = '${req.params.requestno}' AND intRHWID = '${req.body.hwid}'`,function (err) {
      console.log(''+err);
      res.redirect('/request_add/mylist_'+req.body.transid, flog, findcreatedlist, findcreateditem, findcountcreateditem, findmservice, findskills, findresult, rendermylist);
    })
  }
}
router.post('/decision_:requestno', flog, clientdecision)


// ----------------------------------------------------------------------------------VIEW HW PROFILE
router.get('/hw_profile_:userid:hwid', flog, findhw, findhweduc, findhwwork, findcreatedlist, renderhwprofile)
function renderhwprofile(req,res){
  if(req.valid==1)
    res.render('request_add/views/hw_profile',{usertab: req.user, hw1tab: req.hw1, hw2tab: req.hw2, hw3tab: req.hw3, listtab: req.list});
  else if(req.valid==0)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
function findhw(req,res,next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tbluser INNER JOIN tblhouseholdworker on intID = intHWID INNER JOIN tblmservice AS a ON intServiceID=a.intID WHERE tbluser.intID =?",[req.params.hwid], function (err, results) {
    console.log(''+req.params.hwid);
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.hw1 = results;
    return next();
  });
}

function findhweduc(req,res,next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblhw_educbg WHERE intHWID_educbg = ? ",[req.params.hwid], function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.hw2 = results;
    return next();
  });
}
function findhwwork(req,res,next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblhw_workbg WHERE intHWID_workbg = ? ",[req.params.hwid], function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.hw3 = results;
    return next();
  });
}





















// router.get('/createlist_set_preferences', flog, findmservice, rendercreatelist_set_preferences);

// router.post('/add_to_list',(req, res) => {
//   if(req.body.add=="add_another"){
//     // var db = require('../../lib/database')();
//     // db.query(`INSERT INTO tblmincidentreport (strName, strDesc, strStatus)  VALUES ("${req.body.incidentname}", "${req.body.incidentdesc}", "Active")`, (err) => {
//     // if (err) console.log(err);
//     //   res.render('/request_add/createlist_results');
//     //   });
//     console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
//   }
//   else if(req.body.add=="finish"){
//     // var db = require('../../lib/database')();
//     // db.query(`INSERT INTO tblmincidentreport (strName, strDesc, strStatus)  VALUES ("${req.body.incidentname}", "${req.body.incidentdesc}", "Active")`, (err) => {
//     // if (err) console.log(err);
//     //   res.render('/request_add/createlist_results');
//     // });
//     console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');
//   }
  
// });

function rendercreatelist_results(req,res){
  // if(req.valid==1)
  //   res.render('request_add/views/createlist_results',{usertab: req.user});
  // else if(req.valid==0)
  //   res.render('admin/views/invalidpages/normalonly');
  // else
  //   res.render('login/views/invalid');
}
router.get('/createlist_results', flog, rendercreatelist_results);

function rendercreatelist_summary(req,res){
  if(req.valid==1)
    res.render('request_add/views/createlist_summary',{usertab: req.user});
  else if(req.valid==0)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
router.get('/createlist_summary', flog, rendercreatelist_summary);





exports.request_add= router;

                      