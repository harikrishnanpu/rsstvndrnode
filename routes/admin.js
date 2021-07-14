var express = require('express');
var router = express.Router();
var contentHelper = require('../helpers/content-helper');
var adminHelper = require('../helpers/adminHelpers');
const userHelpers = require('../helpers/userHelpers');
const verifyLogin = (req,res,next)=>{
  if(req.session.adminLoggedIn && req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

router.get('/',verifyLogin, function(req, res, next) {
    res.render('admin/index',{admin:true ,"Admin":req.session.admin,"updatesuccess":req.session.updatedsuccess})
    req.session.updatedsuccess = false;
});

router.get('/add-details', (req,res)=>{
  res.render('admin/add-details',{admin:true,"Admin":req.session.admin} )
});

router.get("/refund",(req,res)=>{
  adminHelper.getRefundForm().then((response)=>{
    res.render("admin/refund",{admin:true,Admin:req.session.admin,"data":response})
  })
})

router.post('/add-content', (req,res)=>{
  contentHelper.addDetails(req.body, (id)=>{
    res.redirect('/add-content',{Admin:req.session.admin})
  })
});

router.get("/gurudakshina",(req,res)=>{
  adminHelper.getAllGurudakshina().then((response)=>{
    res.render("admin/gurudakshina",{payments:response,Admin:req.session.admin,admin:true})
  })
})

router.get('/signup',verifyLogin,(req,res)=>{
  res.render('admin/signup',{admin:true} )
});

router.get('/login',(req,res)=>{
  res.render('admin/login',{"loginErr":req.session.adminLogginErr,admin:true});
  req.session.adminLogginErr = false; 
});

router.get("/add-user",(req,res)=>{
  res.render("admin/add-user",{admin:true,Admin:req.session.admin})
})

router.get("/blood-donators",(req,res)=>{
  adminHelper.getBloodDonators().then((donators)=>{
  res.render("admin/blood-donators",{donators:donators,admin:true,Admin:req.session.admin})
  })
})

router.get("/ghoshclass",verifyLogin,(req,res)=>{
  res.render("admin/ghosh",{Admin:req.session.admin,admin:true})
})

router.post("/add-user",verifyLogin,(req,res)=>{
  contentHelper.addBloodDonators(req.body).then(()=>{
    req.session.updatedsuccess = true;
    res.redirect("/admin")
  })
})

router.get("/addghoshclass",(req,res)=>{
  res.render("admin/addghoshclass",{Admin:req.session.admin,admin:true})
})

router.get("/joinclass",(req,res)=>{
  adminHelper.getGhoshClassData().then((data)=>{
    res.render("admin/joinclass",{Admin:req.session.admin, admin:true, classes:data.reverse()})
  })
})

router.post("/add-ghosh-class",(req,res)=>{
  contentHelper.addGhoshClass(req.body).then(()=>{
    res.redirect("/admin/ghoshclass")
  })
});

router.get("/ghosh-members",(req,res)=>{
  adminHelper.getGhoshMembers().then((datas)=>{
    res.render("admin/ghosh-members",{Admin:req.session.admin,admin:true,users:datas})
  })
})

router.post('/login',(req,res)=>{
  adminHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.adminLoggedIn = true;
      req.session.admin= response.user;
      req.session.updatedsuccess = true;
      res.redirect('/admin')
    }else{
      req.session.adminLogginErr = true;
      res.redirect('/admin/login')
    }
  })
});

router.post('/signup' , (req,res)=>{
  adminHelper.doSignup(req.body).then((response)=>{
    if(response.status){
      req.session.adminLoggedIn = true;
      req.session.admin= response.user;
      req.session.updatedsuccess = true;
      res.redirect('/admin')
    }
  })
});

router.get('/all-users',verifyLogin,(req,res)=>{
  adminHelper.getAllUsers().then((result)=>{
    let allusers = result
    res.render('admin/all-users',{allusers,admin:true,"Admin":req.session.admin})
  })
});

router.get('/edit-details/:id',verifyLogin,async(req,res)=>{
  let contentDetails = await contentHelper.getOneContentDetails(req.params.id);
  res.render('admin/edit-details',{contentDetails,admin:true,"Admin":req.session.admin})
});

router.post('/edit-content/:id',(req,res)=>{
  adminHelper.updateDetails(req.params.id,req.body).then(()=>{
    req.session.updatedsuccess = true;
    res.redirect('/admin')
  })
});

router.get('/add-notify/:id',(req,res)=>{
  res.render('admin/add-notify',{admin:true,"userId":req.params.id,"Admin":req.session.admin})
});


router.post('/add-notify',(req,res)=>{
  adminHelper.addNotification(req.body).then(()=>{
    req.session.updatedsuccess = true;
    req.session.notify = true;
    res.redirect('/admin')
  })
});

router.get('/add-site-notify',(req,res)=>{
  res.render('admin/add-site-notify',{admin:true,"Admin":req.session.admin})
})

router.post('/add-site-notify',(req,res)=>{
  adminHelper.addSiteNotification(req.body).then(()=>{
    req.session.notify = true;
    req.session.updatedsuccess = true;
    res.redirect('/admin')
  })
});

router.get('/need-blood',verifyLogin,(req,res)=>{
  adminHelper.getNeedBloodData().then((details)=>{
    res.render('admin/get-need-blood',{admin:true,"Formdata":details,"Admin":req.session.admin})
  })
});

router.get('/add-karyakari',verifyLogin,(req,res)=>{
  res.render('admin/add-karyakari',{admin:true,"Admin":req.session.admin});
})

router.post('/add-karyakari',(req,res)=>{
  adminHelper.addkaryakari(req.body).then((result)=>{
    if(result){
      req.session.updatedsuccess = true;
      res.redirect('/admin')
    }else{
      res.redirect('/add-karyakari')
    }
  })
});

router.get('/add-latest-updates',(req,res)=>{
  res.render('admin/add-latest-updates',{admin:true,"Admin":req.session.admin})
});

router.post('/add-latest-updates',(req,res)=>{
  adminHelper.addLatestUpdates(req.body).then((contentId)=>{
    req.session.updatedsuccess = true;
    let image = req.files.image;
    image.mv("./updates/"+contentId+".png",(err,done)=>{
      if(!err){
        res.redirect("/admin")
      }
    })
  });
})

router.get('/get-contact',(req,res)=>{
  adminHelper.getContactUsFormData().then((details)=>{
    res.render('admin/getcontact',{details,admin:true,"Admin":req.session.admin})
  })
});

router.get("/contents",verifyLogin,(req,res)=>{
  contentHelper.getContentDetails().then((content)=>{
    res.render("admin/contents",{admin:true,content,"Admin":req.session.admin})
  })
})

module.exports = router;