import {InsertElement, RandomInt, ConmuteClassAndInner, AnimateWithTransparent, emailToId} from './utils.js'
import {createUserData ,getUserData, updateScore, createDump} from "./database.js";
import {loadDataFile} from './files.js'
import * as views from "./views.js";


window.views = views
views.GoTo("Register")

const Login = (form)=>{
    // createUserData(
    //     emailToId(form.elements['idCorreo'].value),
    //     form.elements['idCorreo'].value,
    //     form.elements['idNombreCompleto'].value,
    //     form.elements['idEmpresa'].value,
    //     form.elements['idAssesment'].value,
    //     form.elements['idMailbox'].value
    // ).then((res)=>{
    //     userID = emailToId(form.elements['idCorreo'].value);
        alert("Instrucciones01")
    // }).catch(()=> {
    //     alert("Ha ocurrido un error, intente nuevamente.")
    // })
}

window.TryLogin = (form)=>{
    console.log(form);
    getUserData().then((res)=>{
        let exist = false
        for (const u in res) 
            if (res.hasOwnProperty(u)) 
                console.log(form.elements);
                // exist |= u===emailToId(form.elements['Email'].value)
        if(exist)
            alert("Existe")
        else
            Login(form)
        return false;

    }).catch((res)=> {
        console.log("Error login: "+res)
        alert("Ranking, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}

window.createDump = ()=>{
    createDump();
}