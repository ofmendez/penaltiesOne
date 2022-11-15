import { emailToId , ñ, RandChar} from './utils.js'
import {createUserData ,getUserData, updateScore, createPartner} from "./database.js";
import * as views from "./views.js";
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


const Register = (form,dbSnap, uId)=>{
    let reg =0
    if(dbSnap.child(uId).exists())
        if(dbSnap.child(`${uId}/register`).exists())
            reg = dbSnap.child(`${uId}/register`).val()
    createUserData(
        uId,
        form.elements.namedItem('NombreCompleto').value,
        form.elements.namedItem('Pais').value,
        form.elements.namedItem('Email').value,
        form.elements.namedItem('Compania').value,
        form.elements.namedItem('Cargo').value,
        form.elements.namedItem('MontoVenta').value,
        form.elements.namedItem('Reseller').value,
        form.elements.namedItem('ArchivosCarga').files,
        (reg+1) 
    ).then((res)=>{
        userID = emailToId(form.elements.namedItem('Email').value);
        console.log("Register function");
        form.reset();
        ñ('#loadingMessage').hidden = true
        ñ('#okForm').hidden = false
    }).catch((e)=> {
        ñ('#buttonSend').hidden = false
        ñ('#loadingMessage').hidden = true
        console.log("Ha ocurrido un error en Register: "+e)
    });
}

function Loaded(v) {
    let r ='N'
    if(v === views.viewAv[2]  ){
        ñ('#valueGC').innerHTML = `$${urlParams.get('Felicitaciones')}`
        r='W'
    }
    if(v === views.viewAv[2] || v === views.viewAv[3] ){
        updateScore(urlParams.get('UID'),urlParams.get('reg'),urlParams.get('d'),r).then((res)=>{
            console.log(res);
        }).catch((e)=> console.log(e))
    }
}
function AgainL(f) {
    ñ('#errorLogin').hidden =false
    ñ('#buttonSendLogin').hidden = false
    ñ('#loadingMessageLogin').hidden = true
    f.reset()
}

window.TryLogin = (form)=>{
    ñ('#buttonSendLogin').hidden = true
    ñ('#loadingMessageLogin').hidden = false
    getUserData().then((res)=>{
        let userForm = form.elements.namedItem('Usuario').value+"" ;
        let pForm    = form.elements.namedItem('Contrasena').value+"" ;
        let existUser = res.child(userForm.trim()).exists();
        if(existUser){
            let x = true
            let lastr =  res.child(`${userForm}/register`).val()
            let target = ""
            for (let i = 1; i <= lastr; i++) {
                target = res.child(`${userForm}/data-${i}`).exists()? res.child(`${userForm}/data-${i}`).val().toString().split('-') : "";
                if(target.length >1 && target[0] ==="send" && pForm === target[1]){
                    x = false;
                    let country = res.child(`${userForm}/country`).val();
                    let regist = i;
                    let range = res.child(`${userForm}/amount-${regist}`).val();
                    window.location = `${lang[0]}?${lang[1]}=${views.viewDat[range]}&${lang[2]}=${views.viewDat2[range]}&${lang[3]}=${views.viewDat3[range]}&${lang[4]}=${country}&${lang[5]}=${regist}&UID=${userForm}`;
                }
            }
            if( x)
                AgainL(form)
        } else AgainL(form)
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
        let tentUserId = emailToId(form.elements.namedItem('Email').value);
        for (const u in res.val()) 
            if(u===tentUserId){
                let emDB = res.child(`${tentUserId}/email`).val()
                exist |= emDB !== form.elements.namedItem('Email').value
            }
        if(exist)
            alert("Se ha presentado un error con este correo electrónico, prueba con un correo diferente o contacta con nosotros para solucionarlo.")
        else
            Register(form,res,tentUserId)
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

window.TryPartner = (form)=>{
    console.log("try ", form.elements.namedItem('EmailSuscripcion').value);
    ñ('#buttonSend').classList.add('loading') 
    createPartner( form.elements.namedItem('EmailSuscripcion').value ).then((res)=>{
        console.log("done ",res);
        ñ('#buttonSend').classList.remove('loading') ;
        form.reset();
        return false;
    }).catch((res)=> {
        console.log("Error register: "+res);
        alert("Registro, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}


function definirTamanoContenido() {
    let AlturaHeader = document.getElementById('Header').clientHeight;
    let AlturaPantalla = window.innerHeight;
    document.getElementById("ContenidoLogin").style.minHeight = AlturaPantalla - AlturaHeader + "px";
}

function definirTamanoResultado() {
    let AlturaPantalla = window.innerHeight;
    document.getElementById("ContenidoLogin").style.minHeight = AlturaPantalla + "px";
}

window.loadLogin =()=> {
    definirTamanoContenido();
    window.addEventListener('resize', definirTamanoContenido, true);
}

window.loadResultados =()=> {
    definirTamanoResultado();
    window.addEventListener('resize', definirTamanoResultado, true);
    
}


