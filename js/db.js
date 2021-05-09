// console.log(process.env)

// it is: listner for change in database
db.collection("recepies").onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach((change) => {
        console.log(change, change.doc.data(), change.doc.id);
		// if(change.type === 'added') {
		// 	// add the document to the web page
		// }
		// if(change.type === 'added') {
        //     // add the document to the web page
        // }
    });
});

