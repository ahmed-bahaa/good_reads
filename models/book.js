const mongoose = require('mongoose');


const book_schema = new mongoose.Schema({
    name: String,
    cover: String,
    description: String,
    author_id: { type: mongoose.Schema.Types.ObjectId , ref: 'author'},
    category_id: { type: mongoose.Schema.Types.ObjectId , ref: 'category'},
    reviews: [{
        user_id: { type: mongoose.Schema.Types.ObjectId , ref: 'user'},
        user_name: String,
        rate: Number,
        review: String
    }]    
});

const book_model = mongoose.model("book", book_schema );

// postsModel.create({ title:"post 1" , body:"hello" , userId:"5c7eddedbcacb34a42a33ace"})



module.exports=book_model;


//remaining:
// cover 
// avergae rate  
 



// avergae rate function 


// CpuUtilization.aggregate({
// 	// $match: { instance_id: { $gte: 21 }}
// 	$match : {
// 		instance_id : 'i-2d800b2a',
// 		time_stamp : {
// //			$lt : new Date('Tue Jan 21 2014 19:31:00 GMT+0900 (대한민국 표준시)')
// 			$lt : new Date('2014-01-21 10:31:00.000Z')
// 		}
// 	}
// }).group({
// 	_id : '$instance_id',
// 	markAvg : {
// 		$avg : '$average'
// 	}
// }).exec(function(err, res) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(res);
// 	}
// });
