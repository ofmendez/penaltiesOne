import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import { getDatabase, set, ref, onValue, child, push, update, remove } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import { getStorage, uploadBytes, ref as sRef } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js'
import {loadCredentials} from './files.js'

let firebaseConfig = {}
let database ={}
let app = {}
let storage = {}
let existDatabase = false;
let imagesRef = {}

const getDB = function (){
    return new Promise((resolve,reject)=>{
        if (existDatabase){
            resolve(database)
        } else{
            existDatabase =true;
            loadCredentials().then((res)=>{
                firebaseConfig =res;
                app = initializeApp(firebaseConfig);
                database = getDatabase(app);
                storage = getStorage(app);
                resolve(database);
            });
        }
    });
};

export function uploadImagesToUser(userId,files) {
    return new Promise((resolve,reject)=>{
        let loaded = 0
        if(files.length == 0 )
            resolve("Sin imagenes a cargar!");
        Array.from(files).forEach((img,i) => {
            imagesRef = sRef(storage, `${userId}/${i+1}-${img.name}`);
            uploadBytes(imagesRef, img).then((snapshot) => {
                loaded ++;
                console.log('Uploaded a blob or file! -> '+i+" "+snapshot);
                if(loaded==files.length)
                    resolve("Cargadas Las Imagenes");
            }).catch((e) => reject("Una de las imagenes no fue posible cargarla: "+e));
        });
    });
}


export function getUserData() {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const starCountRef = ref(db, '/users');
            onValue(starCountRef, (snapshot) => {
                resolve(snapshot);
            }, {
                onlyOnce: false
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}



export function updateScore(userId, newScore) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const updates = {};
            updates['/users/' + userId+'/score'] = newScore;
            update(ref(db), updates).then(()=>{
                resolve("Updated!! ")
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}

export function DeleteUser(userId) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + userId),  null ).then((res)=> resolve("DELETED!!"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}


export function createUserData(userId, name, country, email, company, position, amount, consent, files) {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            uploadImagesToUser(userId,files).then((msg)=>{
                console.log(msg);
                set(ref(db, 'users/' + userId), {
                    username: name,
                    country: country,
                    email: email,
                    company: company,
                    position: position,
                    amount: amount,
                    score : 0,
                    consent: consent
                }).then((res)=> resolve("writted"));
            }).catch((e)=> reject("error uploadFile: "+e));
        }).catch((e)=> reject("error getDB: "+e))
    });
}


export function createDump() {
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + "totoyykaren-at-gmail-com"), {
                username: "Perencejo2",
                country: "Argentina",
                email: "ofmendez@gmail.com",
                company: "company Z",
                position: "Position",
                amount: "Amount Z",
                score : 100,
                consent : true,
                urlFile : "http://tyutyutyutyu"
            }).then((res)=> resolve("writted"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}

// export {createUserData }