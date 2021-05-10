// it is: offline data access and sync after getting back online
db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition'){
            // ! maybe multiple tabs oppened at once
            console.log('persistence failed')
        } else if(err.code == 'unimplemented'){
            // ! lack of browser support
            console.log('persistence is not available')
        }
    })

// it is: listner for change in database
// * this listens to firestore as well as browser's indexedDB, so data sync is well maintained
db.collection("recepies").onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach((change) => {
        console.log(change, change.doc.data(), change.doc.id);
		if(change.type === 'added') {
			// *  add the document to the web page
            renderRecipe(change.doc.data(),change.doc.id);
		}
		if(change.type === 'removed') {
            // * remove the document from the web page
            removeRecipe(change.doc.id);
        }
    });
});

// it is: add new recipes
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    // * this prevents the page from loading on pressing submit button
    evt.preventDefault();

    const recipe = {
        title : form.title.value,
        ingredients : form.ingredients.value,
    }

    // * adding the submitted data to our firestore DB
    db.collection('recepies').add(recipe)
        .catch(err => console.log(err));

    // * resetting the form values
    form.title.value = '';
    form.ingredients.value = '';
})

// it is: deleting a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click',evt => {
    // console.log(evt);
    if(evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('recepies').doc(id).delete();
    }
})