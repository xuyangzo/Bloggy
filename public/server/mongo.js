const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

class MongoOperation {

    constructor() {
        this.uri = "mongodb+srv://Bloggy:bloggy@233.com@bloggy-umw0a.mongodb.net/test?retryWrites=true";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true });
    }

    insert(data) {

        // connect to database
        this.client.connect(err => {

            if (err) {
                console.log('Unable to connect to database.');
            } else {
                console.log('Success.');
                const collection = this.client.db("test").collection("devices");

                // perform actions on the collection object
                collection.insertOne(data, function(err, result) {
                    // assert result and call callback function
                    console.log("Inserted 1 document into the collection");
                });

            }

            // close database
            this.client.close();
        });
    }

}

module.exports = MongoOperation;