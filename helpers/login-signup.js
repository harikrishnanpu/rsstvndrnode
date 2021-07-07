var db = require('../config/connection');
var collections = require('../config/collections');
const bcrypt = require('bcrypt');
module.exports={
    doSignup:(userData)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
           userData.password = await bcrypt.hash(userData.password , 10);
           let user = await db.get().collection(collections.USERS_COLLECTION).findOne({phone:userData.phone})
           if(user){
              console.log("User Already Exists");
              resolve(response.status = false)
           }else{
               db.get().collection(collections.USERS_COLLECTION).insertOne(userData).then((data)=>{
                   response.status=true
                   response.user=data.ops[0]
                   resolve(response)
               })
            }
        })
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response ={}
            let user = await db.get().collection(collections.USERS_COLLECTION).findOne({phone:userData.phone});            if(user){
                if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("Login Success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("Login Failed");
                        resolve({pstatus:false})
                    }
                })
            }else{
                resolve({status:false})
                console.log("Login Failed");
            }
        }else{
            resolve({status:false})
            console.log("Login Failed");
        }

        })
    }
}