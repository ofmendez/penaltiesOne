import { emailToId , ñ, RandChar} from './utils.js'
import {createUserData ,getUserData, updateScore, createDump, uploadImagesToUser} from "./database.js";
import * as views from "./views.js";
import {b64EncodeUnicode} from "./codification.js"
/*
 http://127.0.0.1:5500/game.html?penalties=4&win=345&gc=84
*/
let urlParams = new URLSearchParams(window.location.search);
const lang = ['game.html','penalties','win','gc','country','reg','audio']

window.views = views
let userID = ''
if( views.viewAv.includes(Array.from(urlParams.keys())[0] ) )
    views.GoTo(Array.from(urlParams.keys())[0]).then((res)=>Loaded(res))
else
    views.GoTo("Register")


const Register = (form)=>{
    createUserData(
        emailToId(form.elements.namedItem('Email').value),
        form.elements.namedItem('NombreCompleto').value,
        form.elements.namedItem('Pais').value,
        form.elements.namedItem('Email').value,
        form.elements.namedItem('Compania').value,
        form.elements.namedItem('Cargo').value,
        form.elements.namedItem('MontoVenta').value,
        form.elements.namedItem('checkbox').checked, 
        form.elements.namedItem('ArchivosCarga').files, 
    ).then((res)=>{
        userID = emailToId(form.elements.namedItem('Email').value);
        console.log("Register function");
        form.reset();
        ñ('#loadingMessage').hidden = true
        ñ('#okForm').hidden = false
    }).catch((e)=> {
        alert("Ha ocurrido un error, intente nuevamente."+e)
    })
}

function Loaded(v) {
    if(v === views.viewAv[2]  )
        ñ('#valueGC').innerHTML = `$${urlParams.get('Felicitaciones')}`
    if(v === views.viewAv[2] || v === views.viewAv[3] ){
        console.log(urlParams.get('d'));
        console.log(urlParams.get('reg'));
    }
}

window.TryLogin = (form)=>{
    ñ('#buttonSendLogin').hidden = true
    ñ('#loadingMessageLogin').hidden = false
    getUserData().then((res)=>{
        let exist = false

        for (const u in res.val()) 
            exist |= u===emailToId(form.elements.namedItem('Usuario').value)
        let target = res.child(`${emailToId(form.elements.namedItem('Usuario').value)}/data`).val().toString().split('-')
        console.log(exist, target.length,target[0],form.elements.namedItem('Contrasena').value, target[1],form.elements.namedItem('Contrasena').value ===target[1] );
        if(exist && target.length >1 && target[0] ==="send" && form.elements.namedItem('Contrasena').value === target[1]){
            let country = res.child(`${emailToId(form.elements.namedItem('Usuario').value)}/country`).val();
            let regist = res.child(`${emailToId(form.elements.namedItem('Usuario').value)}/register`).val();
            let range = res.child(`${emailToId(form.elements.namedItem('Usuario').value)}/amount-${regist}`).val();
            window.location = `${lang[0]}?${lang[1]}=${views.viewDat[range]}&${lang[2]}=${views.viewDat2[range]}&${lang[3]}=${views.viewDat3[range]}&${lang[4]}=${country}&${lang[5]}=${regist}`;
        }else{
            ñ('#errorLogin').hidden =false
            ñ('#buttonSendLogin').hidden = false
            ñ('#loadingMessageLogin').hidden = true
            form.reset()
        }
    }).catch((res)=> {
        console.log("Error login: "+res);
        ñ('#buttonSendLogin').hidden = false
        ñ('#loadingMessageLogin').hidden = true
        alert("Login, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}


window.TryRegister = (form)=>{
    ñ('#buttonSend').hidden = true
    ñ('#loadingMessage').hidden = false
    getUserData().then((res)=>{
        let exist = false
        for (const u in res.val()) {
            exist |= u===emailToId(form.elements.namedItem('Email').value)
        }
        if(exist)
            alert("Este correo ya se encuentra registrado")
        else
            Register(form)
        return false;
    }).catch((res)=> {
        console.log("Error register: "+res);
        ñ('#buttonSend').hidden = false
        ñ('#loadingMessage').hidden = true
        alert("Registro, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}

window.createDump = ()=>{
    createDump();
}


// string that has to create hashcode
let str = "asd"
// console.log( b64EncodeUnicode(str).replace(/[0-9_=\/]+/g,'').toUpperCase().substring(0, 8).padStart(8, RandChar()));
// console.log( Math.floor(10000000 + Math.random() * 90000000));