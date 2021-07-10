var db = require('../config/connection');
var collections = require('../config/collections');
const objectID = require('mongodb').ObjectID;
const Razorpay = require("razorpay");
var instance = new Razorpay({
    key_id: 'rzp_live_59jGYFg74IOePb',
    key_secret: 'GdT68bWdBoMy5gh1NuCBaxyq',
  });


module.exports={
    needBlood:(userData,callback)=>{
        db.get().collection(collections.NEED_BLOOD_COLLECTION).insertOne(userData).then((response)=>{
            callback(response)
        })
     },

     getPersonalNotifications:(userId)=>{
        let status = false;
      return new Promise(async(resolve,reject)=>{   
       let usernotification =await  db.get().collection(collections.NOTIFICATION_COLLECTION).find({userId:userId}).toArray();
       if(usernotification){
           resolve(usernotification.reverse())
       }else{
           resolve(status)
       }
      
    })
    },

    getSiteNotifications:()=>{
        return new Promise(async(resolve,reject)=>{
            let sitenotify =await db.get().collection(collections.SITE_NOTIFICATION_COLLECTION).find().toArray();
            resolve(sitenotify.reverse())
        })
    },

    getKaryakariDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let details = await db.get().collection(collections.KARYAKARI_COLLECTION).find().toArray();
            resolve(details)
        })
    },

    getNotifyCount:(userid)=>{
        return new Promise((resolve,reject)=>{
            let count = 0;
            let notify = db.get().collection(collections.NOTIFICATION_COLLECTION).find({_id:userid})
        })
    },

    getLatestUpdates:()=>{
        return new Promise((resolve,reject)=>{
            let data = db.get().collection(collections.LATESTUPDATES_COLLECTION).find().toArray();
            resolve(data);
        })
    },

    addContactFormData:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CONTACTUSDATA_COLLECTION).insertOne(details).then(()=>{
                resolve()
            })
        })
    },

    addGhoshData:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.GHOSH_DATA_COLLECTION).insertOne(details).then((data)=>{
                resolve(data.ops[0])
            })
        })
    },

    getGhoshData:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.GHOSH_DATA_COLLECTION).findOne({user:userId}).then((data)=>{
                resolve(data)
            })
        })
    },

    getUsersData:(usrPh)=>{
        return new Promise(async(resolve,reject)=>{
        let user =  await  db.get().collection(collections.USERS_COLLECTION).findOne({phone:usrPh});
        resolve(user)
    })
    },

    getGhoshClassData:(ghosh)=>{
        return new Promise(async(resolve,reject)=>{
           let data = await db.get().collection(collections.GHOSH_CLASS_CONNECTION).find({ghosh:ghosh}).toArray();
           resolve(data.reverse())
        })
    },
    updateUser:(id,details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USERS_COLLECTION).updateOne({_id:objectID(id)},{
                $set:{
                    name:details.name,
                    age:details.age,
                    phone:details.phone
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },

    addGuruDhakshina:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.GURUDHAKSHINA_COLLECTIONS).insertOne(details).then((response)=>{
                resolve(response.ops[0])
            })
        })
    },

    generateRazorPay:(gurudhakshinaId,totalamount)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: totalamount*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+gurudhakshinaId
              };
              instance.orders.create(options, function(err, order) {
                  if(err){
                      console.log(err);
                  }else{
                console.log("New Guru Dhakshina",order);
                resolve(order)
                  }
              });
        })
    },

    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            const crypto = require("crypto");
            let hmac = crypto.createHmac('sha256','Sg9svhWqGba3JCnQLa3qlpOY');
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac=hmac.digest('hex');
            if(hmac == details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },

    changePaymentStatus:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.GURUDHAKSHINA_COLLECTIONS).updateOne({_id:objectID(orderId)},
            {
                $set:{
                    status:"Placed"
                }
            }
            ).then(()=>{
                resolve()
            })
        })
    },

    getAllPaymentStatus:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.GURUDHAKSHINA_COLLECTIONS).find({paymentId:userId}).toArray()
            resolve(data.reverse())
        })
    }
}