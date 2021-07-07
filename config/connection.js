const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}


module.exports.connect = function(done){
    const url = 'mongodb+srv://rsstvndr1234:rsstvndr1234@rsstvndr.dzvjb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    const url1 = 'mongodb://localhost:27017';
    const dbname = 'rsstvndr';

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)

        done()

    });


}

module.exports.get = function(){
    return state.db
}