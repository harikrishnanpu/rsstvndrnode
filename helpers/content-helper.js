var db = require('../config/connection')
var collections = require('../config/collections');
var objectId = require('mongodb').ObjectID;
const { response } = require('express');
module.exports={
    addDetails:(details,callback)=>{
        db.get().collection(collections.CONTENT_COLLECTION).insertOne(details).then((data)=>{
            callback(data.ops[0]._id)
        })
    },

    getContentDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let content = await db.get().collection(collections.CONTENT_COLLECTION).find().toArray()
            resolve(content);
        })
    },

    addBloodDonators:(data)=>{
        return new Promise(async(resolve,reject)=>{
        let response = {}
        let Fdata = await db.get().collection(collections.BLOOD_DONATORS_COLLECTION).findOne({phone:data.phone})
        if(Fdata){
            resolve(response.status = false);
        }else{
        db.get().collection(collections.BLOOD_DONATORS_COLLECTION).insertOne(data).then((formdata)=>{
            response.status = true
            response.lastuser = formdata.ops[0];
            resolve(response); 
        });
        }
    })
    },

    getBloodDonatorsDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let details = await db.get().collection(collections.BLOOD_DONATORS_COLLECTION).find().toArray()
            resolve(details.reverse())
        })
    },

    getLastBloodDonatorsdetails:(callback)=>{
        let details = {};
        return new Promise(async(resolve,reject)=>{
        details = await db.get().collection(collections.BLOOD_DONATORS_COLLECTION).find({})
        console.log(details);
        })
    },

    getOneContentDetails:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CONTENT_COLLECTION).findOne({_id:objectId(id)}).then((details)=>{
                resolve(details)
            })
        })
    },

    addGhoshClass:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.GHOSH_CLASS_CONNECTION).insertOne(data).then(()=>{
                resolve();
            })
        })
    }
}