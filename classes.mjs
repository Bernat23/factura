class Article {
    constructor(codi, nom, preu){
        this.codi = codi;
        this.nom = nom;
        this.preu = preu;
    }
}

class liniaFactura{
    constructor(Article, quantitat = 1){
        this.Article = Article;
        this.quantitat = quantitat;
    }
}

class Factura{
    constructor(nFactura){
        this.nFactura = nFactura;
        this.liniaFactura = [];
    }
}

export{Factura, liniaFactura, Article};