import {Article, Factura, liniaFactura} from "./moduls/classes.mjs";

window.onload = function() {
    crearDesplegable();
    botoAfegir();
    numFactura();
    guardarFactura();
    //canviQuantitat();
}


var factura = new Factura();


function crearArray(){
    let articles = new Array();
    let article = ["peugeot","renault","seat","cupra","fiat","ford","pagani","citroen","ds","alpine","ferrari","porsche","audi","saab","volvo","skoda"];
    for(let i = 0; i < article.length; i++){
        let art = new Article();
        art.codi = i;
        art.nom = article[i];
        art.preu = (i + 1) * 1000;
        articles[i] = art;
    }
    return articles;
}

function crearDesplegable() {
    let articles = crearArray();
    let llistaArticles = document.getElementsByClassName("article")[0];
    let desplegable = document.createElement("select");
    for(let i=0;i<articles.length;i++){     
        let opt = document.createElement("option"); 
        opt.text = articles[i].nom;
        opt.value = articles[i].nom;
        desplegable.options.add(opt); 
    }
    llistaArticles.appendChild(desplegable);
}

function botoAfegir() {
    document.getElementsByTagName("button")[0].addEventListener("click", () =>{afegirProducte();});
}

function afegirProducte() {
    let articles = crearArray();
    let article = document.getElementsByTagName("select")[0].value;
    let art = new Article();
    if(comprovarExisteixProducte(article)) {
        for(let i = 0; i < articles.length; i++){
            if(article === articles[i].nom) {
                art = new Article();
                art = articles[i];
            }
        }
        escriureProducte(art);
    }
    preus();
    crearFactura();
}

function comprovarExisteixProducte(article){
    let table = document.getElementsByTagName("table")[0];
    let trs = table.getElementsByTagName("tr");
    for(let i = 1; i < trs.length; i++){
        let linia = trs[i].getElementsByTagName("th");
        if(trs[i].id === article){
            linia[2].getElementsByTagName("input")[0].value = parseInt(linia[2].getElementsByTagName("input")[0].value) + 1;
            linia[4].innerHTML = calcularTotal(parseInt(linia[3].innerHTML), linia[2].getElementsByTagName("input")[0].value);
            return false;
        }
    }
    return true;
}

function escriureProducte(art){
    let linia =  new liniaFactura();
    linia.Article = art;
    linia.quantitat = 1;
    crearLinia(linia);
}


function calcularTotal(quantitat, preu){
    return quantitat * preu;
}

function canviarQuantitat(id, quantitat, preu){
    let table = document.getElementsByTagName("table")[0];
    let trs = table.getElementsByTagName("tr");
    let total = 0;
    if(quantitat > 0){
        for(let i = 1; i < trs.length; i++){
            let linia = trs[i].getElementsByTagName("th");
            if(trs[i].id === id){
                linia[4].innerHTML = calcularTotal(quantitat, preu);
            }
            total += parseInt(linia[4].innerHTML);
        }
        baseImposable(total);
        IVA(total);
        importTotal(total);
    } else {
        eliminarLinia(id);
    }
    crearFactura();
}

function baseImposable(total) {
    document.getElementsByClassName("preu")[0].innerHTML = total;
}

function IVA(total) {
    document.getElementsByClassName("preu")[1].innerHTML = total * 0.21;
}

function importTotal(total) {
    document.getElementsByClassName("preu")[2].innerHTML = total * 1.21;
}

function numFactura() {
    let d = new Date();
    let year = d.getFullYear();
    let ultimNumero;
    ultimNumero = comptarFactures(year + '/');
    document.getElementsByClassName("num")[0].innerHTML = year + '/' + ultimNumero;
    document.getElementsByClassName("preu")[3].innerHTML = year + '/' + ultimNumero;
}

function comptarFactures(year) {
    let comptador = 1;
    let seguir = true;
    while(seguir){
        let clau = year + comptador;
        if (localStorage.getItem(clau) !== null) {
            seguir = true;
            comptador += 1;
        }
        else {
            return comptador;
        }
    }
}

function crearLinia(linia) {
    let table = document.getElementById("taula");
    let id = document.getElementsByTagName("select")[0].value;
    let input = document.createElement("input");
    input.addEventListener('change', () => {canviarQuantitat(id, input.value, linia.Article.preu)});
    input.value = 1;
    if(linia.quantitat !== null){
        input.value = linia.quantitat;
    }
    input.id = linia.Article.codi;
    let row = document.createElement("tr");
    row.id = linia.Article.nom;
    let cell1 = document.createElement("th");
    let cell2 = document.createElement("th");
    let cell3 = document.createElement("th");
    let cell4 = document.createElement("th");
    let cell5 = document.createElement("th");
    cell1.innerHTML = linia.Article.codi;
    cell2.innerHTML = linia.Article.nom;
    cell3.appendChild(input);
    cell4.innerHTML = linia.Article.preu;
    cell5.innerHTML = calcularTotal(linia.quantitat, linia.Article.preu);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);
    table.appendChild(row);
    crearFactura();
}

function eliminarLinia(id) {
    let linia = document.getElementById(id);
    linia.parentNode.removeChild(linia);
}

function preus(){
    let table = document.getElementsByTagName("table")[0];
    let trs = table.getElementsByTagName("tr");
    let total = 0;
    for(let i = 1; i < trs.length; i++){
        let linia = trs[i].getElementsByTagName("th");
        total += parseInt(linia[4].innerHTML);
    }
    baseImposable(total);
    IVA(total);
    importTotal(total);
}

function crearFactura(){
    let table = document.getElementsByTagName("table")[0];
    let trs = table.getElementsByTagName("tr");
    let nFactura = document.getElementsByClassName("num")[0].innerHTML;
    factura = new Factura(nFactura);
    factura.nFactura = nFactura;
    for(let i = 1; i < trs.length; ++i){
        let linia = trs[i].getElementsByTagName("th");
        let art = new Article();
        art.codi = linia[0].innerHTML;
        art.nom = linia[1].innerHTML;
        art.preu = linia[3].innerHTML;
        let liniaFac = new liniaFactura(art);
        liniaFac.quantitat = linia[2].getElementsByTagName("input")[0].value;
        factura.liniaFactura[factura.liniaFactura.length]=(liniaFac);
    }
    localStorage.removeItem(nFactura);
    localStorage.setItem(nFactura,JSON.stringify(factura));
}

function agafarFactura(pickFactura){
    let nFactura = pickFactura[0].value;
    let factura = new Factura();
    if(localStorage.getItem(nFactura) !== null) {
        document.getElementsByClassName("num")[0].innerHTML = nFactura;
        document.getElementsByClassName("preu")[3].innerHTML = nFactura;
        factura = JSON.parse(localStorage.getItem(nFactura));
        eliminarFiles();
        for(let i = 0; i < factura.liniaFactura.length; ++i) {
            let linia = new liniaFactura();
            linia = factura.liniaFactura[i];
            crearLinia(linia);
        }
        preus();
    } 
}

function eliminarFiles() {
    let table = document.getElementsByTagName("table")[0];
    let trs = table.getElementsByTagName("tr");
    let iteracions =  trs.length;
    for(let i = 1; i < iteracions; i++){
        let linia = trs[1];
        linia.parentNode.removeChild(linia);
    }
}

function guardarFactura() {
    let pickFactura =document.getElementsByClassName("recuperar");
    pickFactura[1].addEventListener("click",() => agafarFactura(pickFactura));
}
