var express = require('express');
var flog = require( '../login/loggedin');
var router = express.Router();

//dashboard
function render(req,res){
  if(req.valid==0)
    res.render('admin/views/index',{usertab: req.user});
  else if(req.valid==1)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}

//hwlist
function renderhwlist(req,res){
  if(req.valid==0)
    res.render('admin/views/hwlist',{usertab: req.user});
  else if(req.valid==1)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}

//--------------------------------------------------------------------------------------MAINTENANCE
function rendermaintenanceIR(req,res){
  if(req.valid==0)
    res.render('admin/views/maintenance_ir',{usertab: req.user, itemtab:req.item});
  else if(req.valid==1)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
function findmincidentreport(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblmincidentreport ", function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.item = results;
    return next();
  });
}


function rendermaintenanceR(req,res){
  if(req.valid==0)
    res.render('admin/views/maintenance_r',{usertab: req.user, itemtab: req.item});
  else if(req.valid==1)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
function findmrequirements(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblmrequirements ", function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.item = results;
    return next();
  });
}

function rendermaintenanceTL(req,res){
  if(req.valid==0)
    res.render('admin/views/maintenance_tl',{usertab: req.user, itemtab:req.item});
  else if(req.valid==1)
    res.render('admin/views/invalidpages/normalonly');
  else
    res.render('login/views/invalid');
}
function findmleave(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblmleave ", function (err, results) {
    if (err) return res.send(err);
    if (!results[0])
    console.log('');
    req.item = results;
    return next();
  });
}

function rendermaintenanceTS(req,res){
  if(req.valid==0)
    res.render('admin/views/maintenance_ts',{usertab: req.user, itemtab: req.item});
  else if(req.valid==1)
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
    req.item = results;
    return next();
  });
}


// Enable requirement
function enableRequirement(req,res){
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmrequirements SET strStatus= 'Active' WHERE strStatus='Inactive' AND intID = ?";
  db.query(sql,[req.params.userid],function (err) {
    if (err) return res.send(err);
    res.redirect('/admin/maintenance_requirements');
  });

}
// Disable requirement
function disableRequirement(req,res){
var db = require('../../lib/database')();
var sql = "UPDATE tblmrequirements SET strStatus= 'Inactive' WHERE strStatus='Active' AND intID = ?";
db.query(sql,[req.params.userid],function (err) {
  if (err) return res.send(err);
  res.redirect('/admin/maintenance_requirements');
});
}

// Enable incident report
function enableIncidentreport(req,res){
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmincidentreport SET strStatus= 'Active' WHERE strStatus='Inactive' AND intID = ?";
  db.query(sql,[req.params.userid],function (err) {
    if (err) return res.send(err);
    res.redirect('/admin/maintenance_incident_report');
  });

}
// Disable incident report
function disableIncidentreport(req,res){
var db = require('../../lib/database')();
var sql = "UPDATE tblmincidentreport SET strStatus= 'Inactive' WHERE strStatus='Active' AND intID = ?";
db.query(sql,[req.params.userid],function (err) {
  if (err) return res.send(err);
  res.redirect('/admin/maintenance_incident_report');
});
}

// Enable leave
function enableLeave(req,res){
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmleave SET strStatus= 'Active' WHERE strStatus='Inactive' AND intID = ?";
  db.query(sql,[req.params.userid],function (err) {
    if (err) return res.send(err);
    res.redirect('/admin/maintenance_type_of_leave');
  });

}
// Disable leave
function disableLeave(req,res){
var db = require('../../lib/database')();
var sql = "UPDATE tblmleave SET strStatus= 'Inactive' WHERE strStatus='Active' AND intID = ?";
db.query(sql,[req.params.userid],function (err) {
  if (err) return res.send(err);
  res.redirect('/admin/maintenance_type_of_leave');
});
}

// Enable service
function enableService(req,res){
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmservice SET strStatus= 'Active' WHERE strStatus='Inactive' AND intID = ?";
  db.query(sql,[req.params.userid],function (err) {
    if (err) return res.send(err);
    res.redirect('/admin/maintenance_type_of_services');
  });

}
// Disable service
function disableService(req,res){
var db = require('../../lib/database')();
var sql = "UPDATE tblmservice SET strStatus= 'Inactive' WHERE strStatus='Active' AND intID = ?";
db.query(sql,[req.params.userid],function (err) {
  if (err) return res.send(err);
  res.redirect('/admin/maintenance_type_of_services');
});
}

router.get('/', flog, render);
router.get('/hwlist', flog, renderhwlist);
router.get('/maintenance_incident_report', flog, findmincidentreport, rendermaintenanceIR);
router.get('/maintenance_requirements', flog, findmrequirements, rendermaintenanceR);
router.get('/maintenance_type_of_leave', flog, findmleave, rendermaintenanceTL);
router.get('/maintenance_type_of_services', flog, findmservice, rendermaintenanceTS);

router.get('/enable_requirement/:userid',flog,enableRequirement);
router.get('/disable_requirement/:userid',flog,disableRequirement);
router.get('/enable_incidentreport/:userid',flog,enableIncidentreport);
router.get('/disable_incidentreport/:userid',flog,disableIncidentreport);
router.get('/enable_leave/:userid',flog,enableLeave);
router.get('/disable_leave/:userid',flog,disableLeave);
router.get('/enable_service/:userid',flog,enableService);
router.get('/disable_service/:userid',flog,disableService);


router.post('/add_requirement',(req, res) => {
  var db = require('../../lib/database')();
  db.query(`INSERT INTO tblmrequirements (strName, strStatus)  VALUES ("${req.body.requirementname}","Active")`, (err) => {
    if (err) console.log(err);
    res.redirect('/admin/maintenance_requirements');
    });
  });
router.post('/edit_requirement',(req, res) => {
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmrequirements SET strName= ? WHERE intID = ?";
  db.query(sql,[req.body.requirementname, req.body.requirementID],function (err) {
    res.redirect('/admin/maintenance_requirements');
    });
  });

router.post('/add_incidentreport',(req, res) => {
  var db = require('../../lib/database')();
  db.query(`INSERT INTO tblmincidentreport (strName, strDesc, strStatus)  VALUES ("${req.body.incidentname}", "${req.body.incidentdesc}", "Active")`, (err) => {
    if (err) console.log(err);
    res.redirect('/admin/maintenance_incident_report');
    });
  });
router.post('/edit_incidentreport',(req, res) => {
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmincidentreport SET strName= ?, strDesc=? WHERE intID = ?";
  db.query(sql,[req.body.incidentname, req.body.incidentdesc, req.body.incidentID],function (err) {
    res.redirect('/admin/maintenance_incident_report');
    });
  });

router.post('/add_leave',(req, res) => {
  var db = require('../../lib/database')();
  db.query(`INSERT INTO tblmleave (strName, strStatus)  VALUES ("${req.body.leavename}","Active")`, (err) => {
    if (err) console.log(err);
    res.redirect('/admin/maintenance_type_of_leave');
    });
  });
router.post('/edit_leave',(req, res) => {
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmleave SET strName= ? WHERE intID = ?";
  db.query(sql,[req.body.leavename, req.body.leaveID],function (err) {
    res.redirect('/admin/maintenance_type_of_leave');
    });
  });

router.post('/add_service',(req, res) => {
  var db = require('../../lib/database')();
  db.query(`INSERT INTO tblmservice (strName, strStatus)  VALUES ("${req.body.servicename}","Active")`, (err) => {
    if (err) console.log(err);
    res.redirect('/admin/maintenance_type_of_services');
  });
});
router.post('/edit_service',(req, res) => {
  var db = require('../../lib/database')();
  var sql = "UPDATE tblmservice SET strName= ? WHERE intID = ?";
  db.query(sql,[req.body.servicename, req.body.serviceID],function (err) {
    res.redirect('/admin/maintenance_type_of_services');
    });
  });


exports.admin= router;
