import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, where, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 

/**
 * Music DB Api for using Firebase
 */

//video 28:21
class MusicDB {
    constructor() {
        this.db = null;
    }

    open() {
        return new Promise((resolve,reject)=>{
            try{
                // Your web app's Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyB6ug1Wc2F8e7kDrhUKdOlIleXM7CxU3ME",
                    authDomain: "my-pwa-37e65.firebaseapp.com",
                    projectId: "my-pwa-37e65",
                    storageBucket: "my-pwa-37e65.appspot.com",
                    messagingSenderId: "145284876755",
                    appId: "1:145284876755:web:16c6c97defed05acc4c726"
                };
    
                // Initialize Firebase
                const app = initializeApp(firebaseConfig);
    
                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);

                if(db){
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                }else{
                    reject("The Dabatabase is not available.")
                }

            }catch(error){
                reject(error.message)
            }
        })
       
    }

    add(title, singerName, like) {
        return new Promise((resolve,reject)=>{
            if(!this.isAvailable){
                console.log("Database not available");
            }

            //create music object to be added
            const music = {
                title: title,
                singer: singerName,
                likes: like
            };

            //connect to firebase collection
            const dbCollection = collection(this.db, "MusicList")

            //Include new object to the collection
            addDoc(dbCollection, music)
                .then((docRef)=>{
                    resolve();
                })
                .catch((error)=>{
                    reject( error.message)
                })
        });
    }

    getAll() {
        return new Promise((resolve,reject)=>{
            if(!this.isAvailable){
                reject('Database not opened');
            }

            //Connects to the firebase collection
            const dbCollection = collection(this.db, 'MusicList');

            //Gets the data from the collection
            getDocs(dbCollection)
                .then((querySnapshot) => {
                    const result = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        data.id = doc.id;
                        result.push(data);
                    });
                    resolve(result);
                })
                .catch((error)=>{
                    reject(error.message)
                });
        });
    }

    delete(id) {
        return new Promise((resolve,reject)=>{
            if(!this.isAvailable){
                reject('Database not opened');
            }

             //Connects to the firebase collection
             const docRef = doc(this.db, 'MusicList', id);

             deleteDoc(docRef)
                .then(()=>{
                    resolve();
                })
                .catch((error) => {
                reject(error.message);
             })
        })
    }

    addLike(id,oldLikeCount){
        return new Promise((resolve,reject)=>{
            if(!this.isAvailable){
                reject('Database not opened');
            }

            //Connects to the firebase collection
            const docRef = doc(this.db, 'MusicList', id);

            updateDoc(docRef, {
                likes: oldLikeCount + 1
            }).then(()=>{
                resolve();
            }).catch((error)=>{
                reject(error.message);
            })
        });
    }

}

export default new MusicDB