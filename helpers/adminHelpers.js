var db = require('../config/connection');
var collections = require('../config/collections');
var bcrypt = require('bcrypt');
const objectID = require('mongodb').ObjectID;


module.exports={
    doSignup:(details)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
           details.password = await bcrypt.hash(details.password , 10);
               db.get().collection(collections.ADMINS_COLLECTION).insertOne(details).then((data)=>{
                   response.status=true
                   response.user=data.ops[0]
                   resolve(response)
               })
        })
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response ={}
            let user =await db.get().collection(collections.ADMINS_COLLECTION).findOne({phone:userData.phone});
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("Login Success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("Login Failed");
                        resolve({status:false})
                    }
                })
            }else{
                resolve({status:false})
                console.log("Login Failed");
            }

        })
    },

    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
       let users =await db.get().collection(collections.USERS_COLLECTION).find().toArray()
            resolve(users)
    })
    },

    updateDetails:(id,details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CONTENT_COLLECTION).updateOne({_id:objectID(id)},{
                $set:{
                    title:details.title,
                    description:details.description,
                    marquee:details.marquee,
                    btntext:details.btntext,
                    content:details.content
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    addNotification:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.NOTIFICATION_COLLECTION).insertOne(details).then(()=>{
                resolve()
            })
    })
    },

    addSiteNotification:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.SITE_NOTIFICATION_COLLECTION).insertOne(details).then(()=>{
                resolve();
            })
        })
    },

    getNeedBloodData:()=>{
        return new Promise(async(resolve,reject)=>{
        let details =await db.get().collection(collections.NEED_BLOOD_COLLECTION).find().toArray();
        resolve(details)
        })
    },

    addkaryakari:(fromData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.KARYAKARI_COLLECTION).insertOne(fromData).then((response)=>{
                resolve(response.ops[0])
            })
        })
    },

    addLatestUpdates:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.LATESTUPDATES_COLLECTION).insertOne(details).then((data)=>{
                resolve(data.ops[0]._id);
            })
        })
    },

    getContactUsFormData:()=>{
        return new Promise((resolve,reject)=>{
            let data = db.get().collection(collections.CONTACTUSDATA_COLLECTION).find().toArray();
            resolve(data)
        })
    },

    getGhoshClassData:()=>{
        return new Promise(async(resolve,reject)=>{
           let data = await db.get().collection(collections.GHOSH_CLASS_CONNECTION).find().toArray();
           resolve(data)
        })
    },

    getGhoshMembers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection(collections.GHOSH_DATA_COLLECTION).find().toArray()
            resolve(users.reverse())
        })
    },

    getBloodDonators:()=>{
        return new Promise(async(resolve,reject)=>{
            let donators = await db.get().collection(collections.BLOOD_DONATORS_COLLECTION).find().toArray()
            resolve(donators.reverse())
        })
    },

    getAllGurudakshina:()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collections.GURUDHAKSHINA_COLLECTIONS).find().toArray()
            resolve(data.reverse())
        })
    },

    getRefundForm:()=>{
        return new Promise(async(resolve,reject)=>{
            let formData = await db.get().collection(collections.REFUND_FORM_COLLECTION).find().toArray();
            resolve(formData.reverse())
        })
    },

    getAllFeedbacks:()=>{
        return new Promise( async (resolve,reject)=>{
            let feedbacks = await db.get().collection(collections.FEEDBACK_COLLECTION).find().toArray();
            resolve(feedbacks)
        })
    }
}