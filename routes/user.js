const express = require('express');
const adminHelpers = require('../helpers/adminHelpers');
const router = express.Router();
var contentHelper = require('../helpers/content-helper');
var loginSignupHelper = require('../helpers/login-signup');
var userHelpers = require('../helpers/userHelpers');

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn && req.session.user) {
    next()
  } else {
    res.redirect('/check')
  }
}


/* GET home page. */
router.get('/',  verifyLogin, function (req, res, next) {
  let user = req.session.user;
  contentHelper.getContentDetails().then((content) => {
    userHelpers.getKaryakariDetails().then((karyakari) => {
      userHelpers.getSiteNotifications().then((Snotify) => {
        userHelpers.getPersonalNotifications(req.session.user._id).then((Pnotify) => {
          contentHelper.getBloodDonatorsDetails().then((bloodDonators)=>{
            userHelpers.getUsersData(req.session.user.phone).then((userData)=>{
          req.session.user = userData;
          req.session.notifyCount = Snotify.length + Pnotify.length;
          let lastUser = bloodDonators[0];
          let yogaDayPoster = true;
          req.session.pcount = Pnotify.length;
          req.session.scount = Snotify.length;
          var KaryakariDetails = karyakari[karyakari.length - 1];
          var latestUpdatesContent = content[0];
          var bloodDonationContent = content[1];
          var galleryContent = content[2];
          var rssGhoshContent = content[3];
          res.render('user/index', {yogaDayPoster, home: true, bloodDonationContent, latestUpdatesContent, galleryContent, rssGhoshContent, user, lastUser, "welmsg": req.session.welcomemsg, "lastkaryakari": req.session.lastkaryakari, KaryakariDetails, "notifyCount": req.session.notifyCount, "notify": req.session.notify,"cs":req.session.cs,"success":req.session.success});
          loginErr = false;
          req.session.welcomemsg = false;
          req.session.notify = false;
          req.session.cs = false;
          req.session.success = false;
          yogaDayPoster = false;
            })
          })
        })
      })
    })
  });
});

router.get('/check',(req,res)=>{
  res.render('user/signup')
});

router.get("/ghosh-baidakh",(req,res)=>{
  res.render("user/ghoshbaidakh",{user:req.session.user})
})

router.get('/blood-donation', verifyLogin, (req, res) => {
  if (req.session.error) {
    contentHelper.getBloodDonatorsDetails().then((details) => {
      contentHelper.getContentDetails().then((content) => {
        var cardContent = content[4];
        let lastUser = details[0];
        res.render('user/blood-donation', {blood:true , cardContent, details, "Error": req.session.error, "lastuser": lastUser, "user":req.session.user })
        req.session.error = false;
      });
    });
  } else {
    contentHelper.getBloodDonatorsDetails().then((details) => {
      contentHelper.getContentDetails().then((content) => {
        let lastUser = details[0];
        var cardContent = content[4];
        res.render('user/blood-donation', {blood:true, cardContent, details, "lastuser": lastUser, "user":req.session.user })
      });
    });
  }
});


router.get('/add-blood-donators', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/blood-donation' ,{"user":req.session.user })

  } else {
    res.render('user/add-blood-donators' ,{ "user":req.session.user })
  }
});

router.post('/add-donators', (req, res) => {
  contentHelper.addBloodDonators(req.body).then((response)=>{
    if (response.status) {
      req.session.lastuser = response.lastuser
      res.redirect('/')
    } else {
      res.redirect('/add-blood-donators')
    }
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr, "loginErr1": req.session.loginErr1, "ploginErr":req.session.ploginErr})
    req.session.loginErr = false;
    req.session.loginErr1 = false;
    req.session.ploginErr = false;
  }
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/signup', { "loginErr": req.session.loginErr })
    req.session.loginErr = false;
  }
})

router.post('/signup', (req, res) => {
  loginSignupHelper.doSignup(req.body).then((response) => {
    if (response.status) {
      contentHelper.addBloodDonators(req.body).then((bloodData)=>{
      if (bloodData.status) {
          req.session.lastuser = bloodData.lastuser
          req.session.loggedIn = true;
          req.session.welcomemsg = true;
          req.session.user = response.user
          res.redirect('/');
    } });
    } else {
      req.session.lastuser = "No Data";
      req.session.loginErr1 = true
      res.redirect('/login')
    }
  })
});

router.post('/login', (req, res) => {
  loginSignupHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      req.session.welcomemsg = true;
      res.redirect('/')
    }else if(response.pstatus == false){
      req.session.ploginErr = true;
      res.redirect('/login')
    }else {
      req.session.loginErr = true;
      res.redirect('/login')
    }
  })
});

router.get('/need-blood', (req, res) => {
  res.render('user/need-blood',{"user":req.session.user })
});

router.post('/need-blood', (req, res) => {
  userHelpers.needBlood(req.body, (result) => {
    req.session.success = true;
    res.redirect('/')
  })
});

router.get('/contact', verifyLogin, (req, res) => {
  res.render('user/contact',{ "user":req.session.user , contact:true});
});

router.get('/notifications', verifyLogin, (req, res) => {
  userHelpers.getSiteNotifications().then((Snotify) => {
    userHelpers.getPersonalNotifications(req.session.user._id).then((Pnotify) => {
      if (Pnotify == false) {
        console.log(Pnotify);
        res.render('user/notifications', {bnotify:true , Snotify , count:req.session.notifyCount, Scount:req.session.scount, Pcount:req.session.pcount, user: req.session.user})
        req.session.notifycount = 0;
      } else {
        res.render('user/notifications', {bnotify: true, Snotify, Pnotify, count:req.session.notifyCount,Scount:req.session.scount,Pcount:req.session.pcount , user: req.session.user})
        req.session.notifycount = 0;
      }
    })
  })
});

router.get("/about",(req,res)=>{
  res.render("user/about",{user:req.session.user})
})

router.get('/latest-updates', (req, res) => {
  userHelpers.getLatestUpdates().then((details)=>{
    let updates = details.reverse();
  res.render('user/latest-updates',{details:updates, "user":req.session.user, latestUpdates:true})
  })
});

router.get('/karyakari',(req,res)=>{
  userHelpers.getKaryakariDetails().then((details)=>{
    let karyakari = details.reverse();
    res.render('user/karyakari',{karyakari, "user":req.session.user })
  })
})

router.post('/contact',(req,res)=>{
  userHelpers.addContactFormData(req.body).then(()=>{
    req.session.success = true;
    res.redirect('/')
  })
});

router.get('/gallery',(req,res)=>{
  res.render("user/gallery",{user:req.session.user})
});

router.get('/rss-ghosh',(req,res)=>{
  userHelpers.getGhoshData(req.session.user._id).then((ghoshData)=>{
    let noclassess = false;
    if(ghoshData){
      userHelpers.getGhoshClassData(ghoshData.ghosh).then((classdata)=>{
      req.session.user.ghosh = ghoshData;
      console.log(classdata);
      if(classdata.length === 0){
      noclassess = true
      res.render('user/rss-ghosh',{"user":req.session.user , ghosh: ghoshData, rssGhosh:true,classes:classdata, noclassess})
      }else{
    res.render('user/rss-ghosh',{"user":req.session.user , ghosh: ghoshData, rssGhosh:true,classes:classdata})
      }    
  })
    }else{
  res.render('user/rss-ghosh',{"user":req.session.user, rssGhosh:true})
    }  
})
});

router.get('/rss-ghosh/register',(req,res)=>{
  if(req.session.user.ghosh){
    res.redirect('/rss-ghosh')
  }else{
  res.render('user/rss-ghosh-register',{"user":req.session.user})
  }
});

router.post('/ghosh-register',(req,res)=>{
  userHelpers.addGhoshData(req.body).then((result)=>{
    req.session.user.ghosh = result;
    res.redirect('/rss-ghosh')
  })
})

router.get('/shaka-vrittam',(req,res)=>{
  req.session.cs = true;
  res.redirect('/')
});

router.get('/about',(req,res)=>{
  res.render('user/about')
});

router.get('/my-account',verifyLogin,(req,res)=>{
  userHelpers.getGhoshData(req.session.user._id).then((ghoshData)=>{
      res.render('user/my-account',{bsetting : true , "user":req.session.user, ghosh: ghoshData})
  });
});

router.get('/logout',(req,res)=>{
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect('/check')
});

router.get("/user/forgotton-password",(req,res)=>{
  res.render("user/forgot-password")
});

router.post("/change-password",(req,res)=>{
  userHelpers.changePassword(req.body).then((response)=>{
    res.json(response)
  })
});

router.get("/password-changed",(req,res)=>{
  res.render("user/password-changed")
});

router.get("/e-shaka",(req,res)=>{
  res.render("user/e-shaka",{user:req.session.user})
});
router.get("/update-profile",(req,res)=>{
  userHelpers.getGhoshData(req.session.user._id).then((ghoshData)=>{  
    res.render("user/update-profile",{user:req.session.user,ghosh:ghoshData})
  })
})


router.post("/update-profile",(req,res)=>{
  userHelpers.updateUser(req.session.user._id,req.body).then((response)=>{
    req.session.updateSuccess = true;
    req.session.user.name = req.body.name;
    req.session.user.age = req.body.age;
    req.session.user.phone = req.body.phone;
    res.redirect("/my-account")
  })
})

router.get("/subhashitham",(req,res)=>{
  res.render("user/subhashitham",{user:req.session.user,subhashitham:true})
});



router.get("/karyakarthakal",(req,res)=>{
  res.render("user/karyakarthakkal",{user:req.session.user})
});





router.get("/ganageetham", (req, res) => {
  res.render("user/ganageetham/ganageetham", { user: req.session.user, ganageetham: true })
});

router.get("/ganageetham1", (req, res) => {
  res.render("user/ganageetham/ganageetham1", { user: req.session.user })
});

router.get("/ganageetham2", (req, res) => {
  res.render("user/ganageetham/ganageetham2", { user: req.session.user })
});

router.get("/ganageetham3", (req, res) => {
  res.render("user/ganageetham/ganageetham3", { user: req.session.user })
});

router.get("/ganageetham4", (req, res) => {
  res.render("user/ganageetham/ganageetham4", { user: req.session.user })
});

router.get("/ganageetham5", (req, res) => {
  res.render("user/ganageetham/ganageetham5", { user: req.session.user })
});

router.get("/ganageetham6", (req, res) => {
  res.render("user/ganageetham/ganageetham6", { user: req.session.user })
});

router.get("/ganageetham7", (req, res) => {
  res.render("user/ganageetham/ganageetham7", { user: req.session.user })
});

router.get("/ganageetham7", (req, res) => {
  res.render("user/ganageetham/ganageetham7", { user: req.session.user })
});

router.get("/ganageetham8", (req, res) => {
  res.render("user/ganageetham/ganageetham8", { user: req.session.user })
});

router.get("/ganageetham9", (req, res) => {
  res.render("user/ganageetham/ganageetham9", { user: req.session.user })
});

router.get("/ganageetham10", (req, res) => {
  res.render("user/ganageetham/ganageetham10", { user: req.session.user })
});

router.get("/ganageetham11", (req, res) => {
  res.render("user/ganageetham/ganageetham11", { user: req.session.user })
});

router.get("/ganageetham12", (req, res) => {
  res.render("user/ganageetham/ganageetham12", { user: req.session.user })
});

router.get("/ganageetham13", (req, res) => {
  res.render("user/ganageetham/ganageetham13", { user: req.session.user })
});

router.get("/ganageetham14", (req, res) => {
  res.render("user/ganageetham/ganageetham14", { user: req.session.user })
});

router.get("/ganageetham15", (req, res) => {
  res.render("user/ganageetham/ganageetham15", { user: req.session.user })
});

router.get("/ganageetham16", (req, res) => {
  res.render("user/ganageetham/ganageetham16", { user: req.session.user })
});

router.get("/ganageetham17", (req, res) => {
  res.render("user/ganageetham/ganageetham17", { user: req.session.user })
});

router.get("/ganageetham18", (req, res) => {
  res.render("user/ganageetham/ganageetham18", { user: req.session.user })
});

router.get("/ganageetham19", (req, res) => {
  res.render("user/ganageetham/ganageetham19", { user: req.session.user })
});

router.get("/ganageetham20", (req, res) => {
  res.render("user/ganageetham/ganageetham20", { user: req.session.user })
});

router.get("/ganageetham21", (req, res) => {
  res.render("user/ganageetham/ganageetham21", { user: req.session.user })
});

router.get("/ganageetham22", (req, res) => {
  res.render("user/ganageetham/ganageetham22", { user: req.session.user })
});

router.get("/ganageetham23", (req, res) => {
  res.render("user/ganageetham/ganageetham23", { user: req.session.user })
});

router.get("/ganageetham24", (req, res) => {
  res.render("user/ganageetham/ganageetham24", { user: req.session.user })
});

router.get("/ganageetham25", (req, res) => {
  res.render("user/ganageetham/ganageetham25", { user: req.session.user })
});


router.get("/amrithavachanam",(req,res)=>{
  res.render("user/amrithavachanam/amrithavachanam",{amritham:true,user:req.session.user})
});

router.get("/amrithavachanam_drji",(req,res)=>{
  res.render("user/amrithavachanam/drji/amrithavachanam",{user:req.session.user})
});

router.get("/amrithavachanam_guruji",(req,res)=>{
  res.render("user/amrithavachanam/guruji/amrithavachanam",{user:req.session.user})
});

router.get("/amrithavachanam_vivekanandhan",(req,res)=>{
  res.render("user/amrithavachanam/vivekanandhan/amrithavachanam",{user:req.session.user})
});

router.get("/videomeet",(req,res)=>{
  res.render("user/meet/videomeet",{videomeet:true})
});

router.get("/gurudhakshina",(req,res)=>{
  if(req.session.user){
  res.render("user/gurudhakshina",{user:req.session.user})
  }else{
    res.render("user/gurudhakshina")
  }
});

router.post("/add-gurudhakshina",(req,res)=>{
  userHelpers.addGuruDhakshina(req.body).then((response)=>{
    // userHelpers.generateRazorPay(response._id , response.amount).then((result)=>{
    //   res.json(result)
    console.log("hbdekdw",response);
    req.session.paymentDetails = response;
    res.redirect("/gurudhakshina1")
    })
  // })
});

router.post("/verify-payment",(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("Payment Success");
      res.json({status:true})
    })
  }).catch(()=>{
    console.log("Payment Failed");
    res.json({status:false})
  })
});

router.get("/weather",(req,res)=>{
  res.render("user/weather")
})

router.get("/payment-success",(req,res)=>{
  res.render("user/payment-success")
});

router.get("/payment-status",(req,res)=>{
  userHelpers.getAllPaymentStatus(req.session.user._id).then((response)=>{
    res.render("user/payment-status",{payments:response,user:req.session.user})
  })
})

router.get("/ended",(req,res)=>{
  res.render("user/meet/thanks",{thanksPage:true})
});


router.get("/july",(req,res)=>{
  res.render("user/july")
});


router.get("/gurudhakshina1",(req,res)=>{

  res.render("user/gurudhakshina1",{"payment":req.session.paymentDetails})
})

module.exports = router;


