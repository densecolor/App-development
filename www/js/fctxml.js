const IPCONFIG = "http://localhost:8080/backendinte/";
//const IPCONFIG = "http://192.168.43.241:8080/backendinte/";

function createCORSRequest(method, url) {
    var xhr = getXMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
//        alert("xhr with credentials");

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
        alert("xhr domain undefined");

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;
        alert("xhr null");

    }
    return xhr;
}

function getXMLHttpRequest()
{
    var xhr = null;

    // Firefox et bien d'autres.
    if (window.XMLHttpRequest)
        xhr = new XMLHttpRequest();
    else

    // Internet Explorer.
    if (window.ActiveXObject)
    {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e)
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    // XMLHttpRequest non supporté.
    else
    {
        alert("Votre navigateur ne supporte pas l'objet XmlHttpRequest.");
        xhr = false;
    }

    return xhr;
}

function l_exercices()
{
    var xhr = getXMLHttpRequest();

    //on récupère le div où on veut rajouter les élements relatifs aux exercices

    var divexercices = document.getElementById("lexercices");
    divexercices.innerHTML = "";

    var xhr = createCORSRequest("GET", "" + IPCONFIG + "ServletAfficherExercices");

    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée 
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');

    //au chargement du xml 
    xhr.onload = function () {

        //on récupère la réponse de l'xml
        var xmlDoc = xhr.responseXML;
        //on récupère les noeuds exercice_libelle et code
        var exerciceslibelle = xmlDoc.getElementsByTagName("exercice_libelle");
        var exercicescode = xmlDoc.getElementsByTagName("code");
        var exerciceobjectif = xmlDoc.getElementsByTagName("objectif");


// pour chaque noeud exercice libelle 
        for (var i = 0; i < exerciceslibelle.length; i++) {

            //on récupère la valeur du noeud exercice libelle
            var txt = exerciceslibelle[i].childNodes[0].nodeValue;
            //on récupère la valeur du noeud code associé a ce libellé
            var code = exercicescode[i].childNodes[0].nodeValue;
            //on récupère la valeur du noeud exercice objectif
            var txtobjectif = exerciceobjectif[i].childNodes[0].nodeValue;
            //on créé un élement p auquel on assoucie la valeur du noeud exercice libellé
            var pexolibelle = document.createElement("p");
            var pexoobjectif = document.createElement("p");
            pexolibelle.appendChild(document.createTextNode(txt));
            pexolibelle.setAttribute("id", "idexo" + code);
            pexolibelle.style.fontWeight = "bold";

            pexoobjectif.appendChild(document.createTextNode("Objectif: " + txtobjectif));
            pexoobjectif.setAttribute("id", "idexoobj" + code);
            //on créé un élément bouton, auquel on rajoute des attributs de type submit
            var btnsup = document.createElement("button");
            btnsup.setAttribute("id", "idbtn" + code);
            btnsup.setAttribute("type", "submit");
            btnsup.setAttribute("class", "btn btn-danger btn-xs");
            btnsup.innerHTML = "Supprimer";
            //on ajoute une fonction onclick à ce bouton avec pour parametre le code de l'exercice
            btnsup.setAttribute('onclick', "supp_exo(" + code + ");");

            //on rajoute un lien de modification de cet exercice 
            var modifierExoLien = document.createElement("a");
            modifierExoLien.setAttribute("class", "btn btn-warning btn-xs")
            modifierExoLien.setAttribute("href", "ModifierExo.html?exomodfi=" + code);
            modifierExoLien.setAttribute("id", "idlienmodifier" + code);
            modifierExoLien.appendChild(document.createTextNode("Modif"));

            var separationhr = document.createElement("hr");
            separationhr.setAttribute("id", "idhrmodifier" + code);

//on rajoute tous les éléments au div 
            divexercices.appendChild(pexolibelle);
            divexercices.appendChild(pexoobjectif);
            divexercices.appendChild(btnsup);
            divexercices.appendChild(modifierExoLien);
            divexercices.appendChild(separationhr);
        }
    };

    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();
}


function supp_exo(a)
{
    var alertediv = document.getElementById("alertesupp");

    var xhr = getXMLHttpRequest();

    var xhr = createCORSRequest("GET", "" + IPCONFIG + "ServletSupprimerExercice?pexoidsupp=" + a);


    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.onload = function () {
        //on récupère la réponse xml
        var xmlDoc = xhr.responseXML;
        var tabmessage = xmlDoc.getElementsByTagName("message");
        var textalert = tabmessage[0].childNodes[0].nodeValue;
        alertediv.style.display = "block";
        alertediv.innerHTML = textalert;

        if (textalert === "Suppression reussie!") {
            alertediv.style.display = "block";
            alertediv.innerHTML = textalert;
            var exoasupp = document.getElementById("idexo" + a);
            var btnasupp = document.getElementById("idbtn" + a);
            var lienexoasupp = document.getElementById("idlienmodifier" + a);
            var objectifExoasupp = document.getElementById("idexoobj" + a);
            var hrExoasupp = document.getElementById("idhrmodifier" + a);

            exoasupp.style.display = "none";
            btnasupp.style.display = "none";
            lienexoasupp.style.display = "none";
            objectifExoasupp.style.display = "none";
            hrExoasupp.style.display = "none";
        }
    };

    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();

}


function creer_exo() {

    //on récupere le div du message d'alerte
    var alertediv = document.getElementById("alerteCreerExo");

//on récupere les champs des inputs
    var nomExo = document.getElementById("NomExercice").value;
    var catExo = document.getElementById("selectionCategorie").value;
    var objExo = document.getElementById("objExercice").value;
    var repetExo = document.getElementById("repetExercice").value;
    var tempsExo = document.getElementById("tempsExercice").value;
    var tempsReposExo = document.getElementById("tempsReposExercice").value;
    var videoExo = document.getElementById("lienVideo").value;

//envoi de la requête au serveur

    var xhr = getXMLHttpRequest();
    var param = "" + IPCONFIG + "ServletAjouterExercice?pnomexo=" + encodeURIComponent(nomExo) + "&pcatExo=" + encodeURIComponent(catExo) + "&pobjExo=" + encodeURIComponent(objExo) + "&pnbRepExo=" + encodeURIComponent(repetExo) + "&pdureeExo=" + encodeURIComponent(tempsExo) + "&pdureeReposExo=" + encodeURIComponent(tempsReposExo) + "&plienVideoExo=" + encodeURIComponent(videoExo);

    var xhr = createCORSRequest("GET", param);

    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');

    xhr.onload = function () {
        var xmlDoc = xhr.responseXML;
        //on récupère le message de la servlet via le xml
        var tabmessage = xmlDoc.getElementsByTagName("message");
        var textalert = tabmessage[0].childNodes[0].nodeValue;
        //on affiche le message a l'utilisateur
        alertediv.style.display = "block";
        alertediv.innerHTML = textalert;
    }
    ;
    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();
}

function l_catexercices()
{
    var xhr = getXMLHttpRequest();

    //on récupère le div où on veut rajouter les élements relatifs aux exercices

    var xhr = createCORSRequest("GET", "" + IPCONFIG + "ServletAfficherCatExercice");

    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée 
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');

    //au chargement du xml 
    xhr.onload = function () {

        //on récupère la réponse de l'xml
        var xmlDoc = xhr.responseXML;

        //on récupère les noeuds code et libelle
        var catexercicesid = xmlDoc.getElementsByTagName("code");
        var catexerciceslib = xmlDoc.getElementsByTagName("libelle");
        var selectcat = document.getElementById("selectionCategorie");

        // pour chaque noeud categorie id 
        for (var i = 0; i < catexercicesid.length; i++) {

            //on récupère la valeur du noeud categorie id
            var textid = catexercicesid[i].childNodes[0].nodeValue;

            //on récupère la valeur du noeud libelle associé a ce code
            var textlibelle = catexerciceslib[i].childNodes[0].nodeValue;
            //on créé un élement option auquel on assoucie la valeur du noeud categorie libellé
            var optcat = document.createElement("option");
            optcat.appendChild(document.createTextNode(textlibelle));

            //on rajoute en value de cette option l'id de la catégorie
            optcat.setAttribute("value", textid);
            selectcat.appendChild(optcat);

        }
    };

    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();

}
function nomAjouter()
{
    var xhr = getXMLHttpRequest();


    var pwd2 = document.getElementById("InputPassword2");

    var nom = document.getElementById("InputNom");
    var prenom = document.getElementById("InputPrenom");
    var tel = document.getElementById("InputTelephone");
    var mail = document.getElementById("InputEmail");
    var genre = document.getElementById("InputGenre");
    var date = document.getElementById("InputDate");
    var pwd = document.getElementById("InputPassword");

    xhr.open("GET", "ServletAjouterNom?nomU=" + encodeURIComponent(nom.value)
            + "&prenomU=" + encodeURIComponent(prenom.value)
            + "&telU=" + encodeURIComponent(tel.value)
            + "&mailU=" + encodeURIComponent(mail.value)
            + "&genreU=" + encodeURIComponent(genre.value)
            + "&dateU=" + encodeURIComponent(date.value)
            + "&pwdU=" + encodeURIComponent(pwd.value)
            + "&pwdU2=" + encodeURIComponent(pwd2.value)
            , true);


    xhr.send(null);

}
function checkForm(form)
{

    var nombre = form.InputTelephone.value;
    var chiffres = new String(nombre);
    var bt = document.getElementById("bouton");


// Enlever tous les charactères sauf les chiffres
    chiffres = chiffres.replace(/[^0-9]/g, '');
// Nombre de chiffres
    compteur = chiffres.length;


    if (form.InputNom.value == "") {
        document.getElementById("errorNom").innerHTML = "champ obligatoire";
        form.InputNom.focus();
        return false;
    }

    if (form.InputPrenom.value == "") {
        document.getElementById("errorPrenom").innerHTML = "champ obligatoire";
        form.InputPrenom.focus();
        return false;
    }
    if (form.InputTelephone.value == "") {
        document.getElementById("errorTel").innerHTML = "champ obligatoire";
        form.InputTelephone.focus();
        return false;
    }
    if (compteur != 10)
    {
        document.getElementById("errorTel").innerHTML = "Assurez-vous de rentrer un numéro à 10 chiffres (xxx-xxx-xxxx)";
        form.InputTelephone.focus();
        return false;
    }
    if (form.InputEmail.value == "") {
        document.getElementById("errorEmail").innerHTML = "champ obligatoire";
        form.InputEmail.focus();
        return false;
    }
    if (form.InputDate.value == "") {
        document.getElementById("errorDate").innerHTML = "champ obligatoire";
        form.InputDate.focus();
        return false;
    }

    if (form.pwd1.value != "" && form.pwd1.value == form.pwd2.value && form.pwd1.value != "") {
        if (form.pwd1.value.length < 6) {
            document.getElementById("errorPwd1").innerHTML = "mot de passe doit contenir au moins 6 caracteres!";

            form.pwd1.focus();
            return false;
        }
        if (form.pwd1.value == form.InputEmail.value) {
            document.getElementById("errorPwd1").innerHTML = "mot de passe doit etre different de Email!";

            form.pwd1.focus();
            return false;
        }
        re = /[0-9]/;
        if (!re.test(form.pwd1.value)) {
            document.getElementById("errorPwd1").innerHTML = "mot de passe doit contenir au moins un nombre(0-9)!";

            form.pwd1.focus();
            return false;
        }
        re = /[a-z]/;
        if (!re.test(form.pwd1.value)) {
            document.getElementById("errorPwd1").innerHTML = "mot de passe doit contenir au moins une lettre en miniscule(a-z)!";

            form.pwd1.focus();
            return false;
        }
        re = /[A-Z]/;
        if (!re.test(form.pwd1.value)) {
            document.getElementById("errorPwd1").innerHTML = "mot de passe doit contenir au moins une lettre en majuscule(A-Z)!";

            form.pwd1.focus();
            return false;
        }
    } else {
        document.getElementById("errorPwd1").innerHTML = "Veuillez saisir et confirmer votre mot de passe!";

        form.pwd1.focus();
        return false;
    }

    return true;

}
function getAllEmail()
{

    var xhr = getXMLHttpRequest();
    var error = document.getElementById("errorEmail");
    var em = document.getElementById("InputEmail");
    var bt = document.getElementById("bouton");

// On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var emails = xhr.responseXML.getElementsByTagName("email");

            for (var i = 0; i < emails.length; i++) {
                if (em.value != null) {
                    if (emails[i].firstChild.nodeValue == em.value) {
                        var flag = true;

                    }
                }
            }
            if (flag == true) {
                error.innerHTML = "ce mail existe deja";
                bt.disabled = true;
            } else {
                error.innerHTML = "";
                bt.disabled = false;
            }
        }
    }
    // var param="email="+ encodeURIComponent(document.getElementById("InputEmail").value);
    list = xhr.open("GET", "" + IPCONFIG + "ServletAfficherU", true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(null);

}


function verifCo()
{

    var xhr = getXMLHttpRequest();
    var inMail = "";
    var inMdp = "";

    inMail = document.getElementsByName("inputLoginEmail")[0].value;

    //inMdp = document.getElementById("InputLoginEmail").value;
    inMdp = document.getElementById("exampleInputPassword1").value;


    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {

            var elt = document.getElementById("erreur");
            elt.innerHTML = "";

            var xml = xhr.responseXML;
            ;
            // On  vérifie si la personne qui se connecte est un coach
            var listCoach = xml.getElementsByTagName("coach");
            for (var i = 0; i < listCoach.length; i++) {
                var listId = xml.getElementsByTagName("id");
                var listNom = xml.getElementsByTagName("nom");
                var listPre = xml.getElementsByTagName("prenom");
                var valId = listId[0].textContent;
                var valNom = listNom[0].textContent;
                var valPre = listPre[0].textContent;
                sessionStorage.setItem('id', valId);
                sessionStorage.setItem('nom', valNom);
                sessionStorage.setItem('prenom', valPre);
                sessionStorage.setItem('role', "coach");
                document.location.href = "index.html";


            }
            // On récupère les potentielles erreurs de saisie dans la tentative de connexion
            var list = xml.getElementsByTagName("erreur");
            var valeur;

            // Si il n'y a pas d'erreur, alors la boucle sera sautée
            for (var i = 0; i < list.length; i++) {

                valeur = list[i].firstChild.nodeValue;
                elt.innerHTML = elt.innerHTML + valeur;
            }

            var listok = xml.getElementsByTagName("ok");
            // Si les paramtre de connexion sont trouvés alors on redirige vers la page d'accueil
            if (listok.length === 1) {
                var listId = xml.getElementsByTagName("id");
                var listNom = xml.getElementsByTagName("nom");
                var listPre = xml.getElementsByTagName("prenom");
                var valId = listId[0].textContent;
                var valNom = listNom[0].textContent;
                var valPre = listPre[0].textContent;
                sessionStorage.setItem('id', valId);
                sessionStorage.setItem('nom', valNom);
                sessionStorage.setItem('prenom', valPre);

                document.location.href = "menuClient.html";
            }

        }
    };
    // var params = "nomauteur = " + encodeURIcomponent(auteur)  ; 
    console.log(inMail);
    xhr.open("GET", "" + IPCONFIG + "ServletInfoConnexion?mail=" + inMail + "&mdp=" + inMdp, true);
    console.log(inMail);
    xhr.send(null);
}

function affichInfoCo()
{
    var prenom = sessionStorage.getItem('prenom');
    var nom = sessionStorage.getItem('nom');
    if (prenom !== null) {
        document.write(nom + " " + prenom);
    }
}

function affichButDeco()
{
    // on affiche le bouton "déconnexion" uniquement si quelqu'un est connecté
    var prenom = sessionStorage.getItem('prenom');
    var doc = document.getElementById("affichButDeco");
    // "On vérifie si un utilisateur est instancié en session"
    if (prenom !== null) {
        doc.style.display = "block";
    } else
    {
        doc.style.display = "none";
    }

}
function deconnexion()
{
    // On vide les variables de session
    sessionStorage.clear();
    // on recharge la page d'accueil générale
    document.location.href = "index.html";

}

function creer_Seanceype()
{

    //on récupere le div du message d'alerte
    var alertediv = document.getElementById("alerte");

    //on récupere les champs des inputs
    var libelleST = document.getElementById("LibelleSeance");
    var descST = document.getElementById("descSeanceType");

    //on n'autorise plus la suppression des champs
    libelleST.disabled = true;
    descST.disabled = true;

    //envoi de la requête au serveur

    var xhr = getXMLHttpRequest();
    var param = "" + IPCONFIG + "ServletAjouterSeanceType?plibSt=" + libelleST.value + "&pdesST=" + descST.value;

    var xhr = createCORSRequest("GET", param);

    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.onload = function () {
        var xmlDoc = xhr.responseXML;

        //on récupère le contenu de la balise message de l'xml
        var messageST = xmlDoc.getElementsByTagName("message");
        var textalertst = messageST[0].childNodes[0].nodeValue;

        //on récupère le contenu de la balise idSeanceType de l'xml
        var idST = xmlDoc.getElementsByTagName("idSeanceType");
        var textCodeSeanceType = idST[0].childNodes[0].nodeValue;

        //on récupère la paragraphe où on affichera le code de la Séance nouvellement créée
        var pSeanceTypeCode = document.getElementById("idSeanceTypeAlert");
        var inputSeanceTypeCode = document.getElementById("idSeanceTypeHidden");

        //Affichage du numéro de la séance récupéree
        pSeanceTypeCode.innerHTML = "Séance type numéro: " + textCodeSeanceType;
        inputSeanceTypeCode.value = textCodeSeanceType;
        inputSeanceTypeCode.setAttribute("value", textCodeSeanceType);

        //On affichage le message d'alerte 
        alertediv.style.display = "block";
        alertediv.innerHTML = textalertst;

        //on récupère le bouton de création de Séance type et on le désactive
        var btnCreerST = document.getElementById("creerSt");
        btnCreerST.disabled = "true";

        //on rajoute le bouton permettant de rajouter un exercice
        var btnAjouterExercice = document.getElementById("btnrAjoutExercice");
        btnAjouterExercice.style.display = "block";

    }
    ;
    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();
}

function rajouter_Exercice() {

    //Si le div d'affichage du formulaire existe déjà, on le vide
    var divAEnlever = document.getElementById("divlisteExerciceARajouter");
    if (divAEnlever) {
        divAEnlever.innerHTML = "";
    }

    //on récupère le code de la séance type nouvellement créée
    var inputSeanceTypeCode = document.getElementById("idSeanceTypeHidden");
    var codeSeanceType = inputSeanceTypeCode.value;

    //on récupère le div où l'on souhaite afficher le formulaire de rajout d'exercice
    //on lui rajoute les éléments du formulaire
    var divChoixExercice = document.getElementById("divlisteExerciceARajouter");

    //création d'un div et des éléments de design
    var divExercice = document.createElement("div");
    divExercice.setAttribute("id", "idExerciceChoix");
    divExercice.setAttribute("class", "form-group");

    //création du label et de la selection d'exercice
    var labelExercice = document.createElement("label");
    labelExercice.appendChild(document.createTextNode("Selection d'un exercice"));

    var selectExercice = document.createElement("select");
    selectExercice.setAttribute("type", "text");
    selectExercice.setAttribute("class", "form-control");
    selectExercice.setAttribute("id", "listeSelectionExercice");
    selectExercice.setAttribute("onchange", "changerValeurBouton()");


    //création du label et du renseignement du nombre de séries initiales
    var labelExerciceSerie = document.createElement("label");
    labelExerciceSerie.appendChild(document.createTextNode("Nombre de séries de cet exercice"));

    var inputExerciceSerie = document.createElement("input");
    inputExerciceSerie.setAttribute("type", "number");
    inputExerciceSerie.setAttribute("class", "form-control");

    //création du label et du renseignement du numéro d'ordre de l'exercice
    var labelExerciceOrdre = document.createElement("label");
    labelExerciceOrdre.appendChild(document.createTextNode("Ordre de l'exercice"));

    var inputExerciceOrdre = document.createElement("input");
    inputExerciceOrdre.setAttribute("type", "number");
    inputExerciceOrdre.setAttribute("class", "form-control");

    //création du bouton permettant de rajouter cette affection d'exercice à la séance type
    var btnExerciceSTRajouter = document.createElement("input");
    btnExerciceSTRajouter.setAttribute("type", "button");
    btnExerciceSTRajouter.setAttribute("class", "btn btn-primary");
    btnExerciceSTRajouter.setAttribute("value", "+");
    btnExerciceSTRajouter.setAttribute("id", "btnAjoutExo");

    // création d'une séparation de type balise hr
    var separation = document.createElement("hr");

    //création d'un paragraphe d'alerte
    var alertAjoutExercice = document.createElement("small");

    //affectation des éléments au div de formulaire
    divExercice.appendChild(labelExercice);
    divExercice.appendChild(selectExercice);
    divExercice.appendChild(labelExerciceSerie);
    divExercice.appendChild(inputExerciceSerie);
    divExercice.appendChild(labelExerciceOrdre);
    divExercice.appendChild(inputExerciceOrdre);
    divExercice.appendChild(btnExerciceSTRajouter);
    divExercice.appendChild(alertAjoutExercice);
    divExercice.appendChild(separation);

    //affectation des éléments au div principal
    divChoixExercice.appendChild(divExercice);

    //récupération de la requête xml
    var xhr = getXMLHttpRequest();
    //on récupère les exercices pas encore rattachées à la séance type
    var xhr = createCORSRequest("GET", "" + IPCONFIG + "ServletExercicesNotInSeanceType?pCodeSeanceType=" + codeSeanceType);
    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée 
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');

    //au chargement du xml 
    xhr.onload = function () {

        //on récupère la réponse de l'xml
        var xmlDoc = xhr.responseXML;

        //on récupère les noeuds exercice_libelle et code
        var exerciceslibelle = xmlDoc.getElementsByTagName("exercice_libelle");
        var exercicescode = xmlDoc.getElementsByTagName("code");

        if (exerciceslibelle.length === 0) {
            var alertediv = document.getElementById("alerte");
            alertediv.innerHTML = "pas d'exerice disponible!";
            divExercice.innerHTML = "";

        } else {
            // pour chaque noeud exercice libelle 
            for (var i = 0; i < exerciceslibelle.length; i++) {

                //on récupère la valeur du noeud exercice libelle
                var txt = exerciceslibelle[i].childNodes[0].nodeValue;
                //on récupère la valeur du noeud code associé a ce libellé
                var code = exercicescode[i].childNodes[0].nodeValue;

                //on créé un élement option auquel on assoucie la valeur du noeud exercice libellé
                var optionExolibelle = document.createElement("option");
                optionExolibelle.appendChild(document.createTextNode(txt));

                //on rajoute des id pour chaque option 
                inputExerciceSerie.setAttribute("id", "idNbSerie");
                inputExerciceOrdre.setAttribute("id", "idExOrdre");
                optionExolibelle.setAttribute("value", "idexo" + code);
                alertAjoutExercice.setAttribute("id", "idalertAjout");

                //on selectionne la derniere option ajoutée 
                //on initialise la fonction d'ajout du bouton à la valeur de cette option

                selectExercice.appendChild(optionExolibelle);
                optionExolibelle.setAttribute("value", code);


                if (i === 0) {
                    btnExerciceSTRajouter.setAttribute('onclick', "rajouter_ExerciceST(" + code + ")");
                }
            }
        }
    };

    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();
}

function rajouter_ExerciceST(codExo) {

    //on récupère les différents inputs
    var inputSeanceTypeCode = document.getElementById("idSeanceTypeHidden");
    var codeSeanceType = inputSeanceTypeCode.value;
    var inputNbSerie = document.getElementById("idNbSerie");
    var inputOrdreExo = document.getElementById("idExOrdre");
    var alertAjout = document.getElementById("idalertAjout");
    var listeSelectExo = document.getElementById("listeSelectionExercice");


    //on récupère la requête xml
    var xhr = getXMLHttpRequest();

    var xhr = createCORSRequest("GET", "" + IPCONFIG + "ServletSeanceTypeAjouterExo?pExoCode=" + codExo + "&pCodeST=" + codeSeanceType + "&pNbSerie=" + inputNbSerie.value + "&pOrdreEx=" + inputOrdreExo.value);

    //Si le navigateur ne supporte pas le cross domain, une alerte est envoyée 
    if (!xhr) {
        alert("Erreur - Votre navigateur ne supporte pas le crossdomain, veuillez contacter l'administrateur du site");
        return;
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/xml');

    //au chargement du xml 
    xhr.onload = function () {

        var xmlDoc = xhr.responseXML;
        //on récupère le message d'alerte
        var messageST = xmlDoc.getElementsByTagName("message");
        var textalertajout = messageST[0].childNodes[0].nodeValue;
        var alerteTexte = document.createElement("small");
        alerteTexte.innerHTML = textalertajout;
        alertAjout.appendChild(alerteTexte);
        inputNbSerie.disabled = true;
        inputOrdreExo.disabled = true;
        listeSelectExo.disabled = true;
        document.getElementById("btnAjoutExo").disabled = true;

    };

    xhr.onerror = function () {
        alert("Une erreur est apparu lors de l'envoi de la requête");
    };
    xhr.send();

}

function changerValeurBouton() {

    //au changement de la valeur de la balise select, on recupere la valeur et le bouton d'ajout

    var boutonAjout = document.getElementById("btnAjoutExo");
    var listselected = document.getElementById("listeSelectionExercice");

    //on enleve l'attribut onclick et on le remplace

    boutonAjout.setAttribute("onclick", "rajouter_ExerciceST(" + listselected.value + ")");
}



//------------------------------------------------------------------------//

//------------YAO function ajouter programme----------//


function afficherProfil()
{
    var xhr = getXMLHttpRequest();
    var elt = document.getElementById("selectionObjectif");
    // var txt = elt.options[e.selectedIndex].text;
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var noeuds = xhr.responseXML.getElementsByTagName("Profil");
            var codes = xhr.responseXML.getElementsByTagName("codeProfil");
            var texte = "<option></option>";

            for (var i = 0; i < noeuds.length; i++) {
                var profil = noeuds[i].firstChild.nodeValue;
                var code = codes[i].firstChild.nodeValue;
                texte = document.createElement("option");
                texte.appendChild(document.createTextNode(profil));
                texte.setAttribute("id", code + ".idProfil");
                elt.appendChild(texte);

            }
        }
    };
    xhr.open("GET", "" + IPCONFIG + "ServletAfficherProfil", true);
    xhr.send(null);
}
function afficherSeance()
{
    var xhr = getXMLHttpRequest();
    var divlSt = document.getElementById("lSt");
    var br = document.createElement("br");
    var elt = document.createElement("select");
    elt.setAttribute("name", "selectionSt");
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var noeuds = xhr.responseXML.getElementsByTagName("libelleSt");
            var codeSt = xhr.responseXML.getElementsByTagName("codeSt");
            var texte = "<option></option>";
            for (var i = 0; i < noeuds.length; i++) {
                var profil = noeuds[i].firstChild.nodeValue;
                var code = codeSt[i].childNodes[0].nodeValue;
                texte = document.createElement("option");
                texte.appendChild(document.createTextNode(profil));
                texte.setAttribute("id", code + ".idSt");
                elt.appendChild(texte);
            }
            divlSt.appendChild(elt);
            divlSt.appendChild(br);
        }
    };
    xhr.open("GET", "" + IPCONFIG + "ServletAfficherSeance", true);
    xhr.send(null);
}

function dupliquerSt()
{
    afficherSeance();
}

function ajouterProgramme() {
    var xhr = getXMLHttpRequest();
    //var nomU = document.getElementById("selectionU");
    var NomProgramme = document.getElementById("NomProgramme");
    var DescProgramme = document.getElementById("DescProgramme");
    var st = document.getElementsByName("selectionSt");
    var elt = document.getElementById("selectionObjectif");
    var idProfil = elt.options[elt.selectedIndex].id;

    var listest = [];

    for (var i = 0; i < st.length; i++) {
        listest.push(st[i].options[st[i].selectedIndex].id);
    }
    alert(listest);
    xhr.open("GET", "" + IPCONFIG + "ServletAjouterProgramme?idProfilChoisit=" + encodeURIComponent(idProfil)
            + "&NomProgrammeChoisit=" + encodeURIComponent(NomProgramme.value)
            + "&DescProgrammeChoisit=" + encodeURIComponent(DescProgramme.value)
            + "&listeStChoisit=" + encodeURIComponent(listest)
            , true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(null);

}

function validerClient()
{
    var xhr = getXMLHttpRequest();
    var divAvalider = document.getElementById("Avalider");

    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var noeuds = xhr.responseXML.getElementsByTagName("nomU");
            var codes = xhr.responseXML.getElementsByTagName("codeU");
            var statuts = xhr.responseXML.getElementsByTagName("statutU");

            if (noeuds.length == 0) {
                var balise = document.createElement("p");
                var phrase = document.createTextNode("Tous sont validé");
                divAvalider.appendChild(balise);
                divAvalider.appendChild(phrase);

            }
            for (var i = 0; i < noeuds.length; i++) {
                var nomu = noeuds[i].firstChild.nodeValue;
                var codeu = codes[i].firstChild.nodeValue;
                var statutu = statuts[i].firstChild.nodeValue;

                var x = document.createElement("tr");
                var q = document.createElement("td");
                var y = document.createElement("td");
                var z = document.createElement("td");
                var v = document.createElement("td");
                var w = document.createElement("INPUT");
                v.appendChild(w);
                var nom = document.createTextNode(nomu);
                var statut = document.createTextNode(statutu);
                y.appendChild(nom);
                z.appendChild(statut);
                w.setAttribute("type", "button");
                y.setAttribute("id", codeu + ".idValider");
                w.setAttribute("value", "valider");
                w.setAttribute("onclick", "updateStatut(" + codeu + ");window.location.reload()");
                q.setAttribute("visibility", "hidden");
                divAvalider.appendChild(x);
                divAvalider.appendChild(y);
                divAvalider.appendChild(z);
                divAvalider.appendChild(v);
            }
        }
    };
    list = xhr.open("GET", "" + IPCONFIG + "ServletClientAttente", true);
    xhr.send(null);
}


function updateStatut(e)
{
    var xhr = getXMLHttpRequest();

    xhr.open("GET", "" + IPCONFIG + "ServletUpdateStatut?codeChoisit=" + encodeURIComponent(e)
            , true);
    xhr.send(null);

}

//--------------------------------------------------------------------------------------//
//----- YAO integration mensuration 17H52


function afficherCorps() {
    var xhr = getXMLHttpRequest();
    var elt = document.getElementById("corps");
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var noeuds = xhr.responseXML.getElementsByTagName("Corps");
            for (var i = 0; i < noeuds.length; i++) {
                var profil = noeuds[i].firstChild.nodeValue;
                var x = document.createElement("INPUT");
                var y = document.createElement("tr");
                var w = document.createElement("td");
                var t = document.createTextNode(profil);
                var cm = document.createTextNode("(cm)");
                w.appendChild(t);
                x.setAttribute("type", "number");
                x.setAttribute("name", "namecorps");
                x.setAttribute("value", 0);
                x.setAttribute("step", "0.01");
                elt.appendChild(y);
                elt.appendChild(w);
                elt.appendChild(x);
                elt.appendChild(cm);
            }
        }
    };
    xhr.open("GET", "" + IPCONFIG + "ServletAfficherCorps", true);
    xhr.send(null);
}


function ajouterProfil() {
    var xhr = getXMLHttpRequest();
    var selectionObjectif = document.getElementById("selectionObjectif");
    var Poids = document.getElementById("Poids");
    var Taille = document.getElementById("Taille");
    var corps = document.getElementsByName("namecorps");

    var listecorps = [];

    for (var i = 0; i < corps.length; i++) {
        listecorps.push(corps[i].value);
    }
    var idClient = sessionStorage.getItem('id');
    xhr.open("GET", "" + IPCONFIG + "ServletAjouterProfil?profilChoisit=" + encodeURIComponent(selectionObjectif.value)
            + "&PoidsU=" + encodeURIComponent(Poids.value)
            + "&TailleU=" + encodeURIComponent(Taille.value)
            + "&idU=" + encodeURIComponent(idClient)
            //    +"&poitrineU="+encodeURIComponent(poitrine.value)
            + "&listecorps[]=" + encodeURIComponent(listecorps)
            , true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(null);

}

function disp_prompt()
{
    var divprofil = document.getElementById("ajouterProfil");
    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("id", "content");
    var y = document.createElement("INPUT");
    y.setAttribute("type", "button");
    y.setAttribute("id", "buttonContent");
    y.setAttribute("onclick", "newProfil()");
    y.setAttribute("class", "btn btn-primary btn-xs");
    y.setAttribute("value", "+");
    divprofil.appendChild(x);
    divprofil.appendChild(y);

}

function newProfil()
{
    var xhr = getXMLHttpRequest();
    //var divprofil=document.getElementById("ajouterProfil");
    var content = document.getElementById("content");
    //var buttonContent=document.getElementById("buttonContent");
    if (content.value !== null)
    {
        xhr.open("GET", "" + IPCONFIG + "ServletRajouterNewProfil?profilSaisie=" + encodeURIComponent(content.value)
                , true);
        xhr.send(null);
    }
    document.getElementById("ajouterProfil").remove();
}


// FIn Function Yao

//---------------------------------------------//
// Funcction Yohann 

function loadExo() {
    var ex = findGetParameter("exomodfi");
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function () {

        //on récupère la réponse de l'xml
        if (xhr.readyState === 4 && xhr.status === 200) {
            var xmlDoc = xhr.responseXML;
            var divexercices = document.getElementById("lexercices");
            divexercices.innerHTML = "";

            //On récupère les noeuds
            var x = xmlDoc.getElementsByTagName("exercice");
            var exocode = xmlDoc.getElementsByTagName("code")[0];
            var exolib = xmlDoc.getElementsByTagName("exercice_libelle")[0];
            var exoobjectif = xmlDoc.getElementsByTagName("objectif")[0];
            var exocat = xmlDoc.getElementsByTagName("categorie")[0];
            var exorepet = xmlDoc.getElementsByTagName("repetition")[0];
            var exotemps = xmlDoc.getElementsByTagName("temps")[0];
            var exorepos = xmlDoc.getElementsByTagName("repos")[0];
            var exolien = xmlDoc.getElementsByTagName("lien")[0];

            for (var i = 0; i < x.length; i++) {
                var code = x[i].getElementsByTagName("code")[0].firstChild.nodeValue;
                var lib = x[i].getElementsByTagName("exercice_libelle")[0].firstChild.nodeValue;
                var obj = x[i].getElementsByTagName("objectif")[0].firstChild.nodeValue;
                var cat = x[i].getElementsByTagName("categorie")[0].firstChild.nodeValue;
                var repet = x[i].getElementsByTagName("repetition")[0].firstChild.nodeValue;
                var tps = x[i].getElementsByTagName("temps")[0].firstChild.nodeValue;
                var repo = x[i].getElementsByTagName("repos")[0].firstChild.nodeValue;
                var lien = x[i].getElementsByTagName("lien")[0].firstChild.nodeValue;

                //on crée des balises pour mettre en forme un formulaire
                var form = document.createElement("form");
                form.setAttribute("id", "idcode" + code);

                var plib = document.createElement("p");
                plib.innerHTML = "Le nom : ";
                var inlib = document.createElement("input");
                inlib.append(lib);
                inlib.setAttribute("id", "idlib");
                inlib.setAttribute("value", lib);
                plib.append(inlib);

                var pobj = document.createElement("p");
                pobj.innerHTML = "La description : ";
                var inobj = document.createElement("input");
                inobj.append(document.createTextNode(obj));
                inobj.setAttribute("id", "idobj");
                inobj.setAttribute("value", obj);
                pobj.append(inobj);

                var prepet = document.createElement("p");
                prepet.innerHTML = "Le nombre de répétition : ";
                var inrepet = document.createElement("input");
                inrepet.append(document.createTextNode(repet));
                inrepet.setAttribute("id", "idrepet");
                inrepet.setAttribute("value", repet);
                prepet.append(inrepet);

                var ptps = document.createElement("p");
                ptps.innerHTML = "La durée : ";
                var intps = document.createElement("input");
                intps.append(document.createTextNode(tps));
                intps.setAttribute("id", "idtps");
                intps.setAttribute("value", tps);
                ptps.append(intps);

                var prepo = document.createElement("p");
                prepo.innerHTML = "Le temps de repos : ";
                var inrepo = document.createElement("input");
                inrepo.append(document.createTextNode(repo));
                inrepo.setAttribute("id", "idrepo");
                inrepo.setAttribute("value", repo);
                prepo.append(inrepo);

                var plien = document.createElement("p");
                plien.innerHTML = "Le lien de la video : ";
                var inlien = document.createElement("input");
                inlien.append(document.createTextNode(lien));
                inlien.setAttribute("id", "idlien");
                inlien.setAttribute("value", lien);
                plien.append(inlien);

                //Ajout de tous les liens au form
                form.append(plib);
                form.append(pobj);
                form.append(prepet);
                form.append(ptps);
                form.append(prepo);
                form.append(plien);

                //Ajout du form au div
                divexercices.appendChild(form);
            }
        }
    };
    xhr.open("GET", "" + IPCONFIG + "ServletAfficherExo?exo=" + ex, true);
    xhr.send(null);
}

//Recupere le paramatre de l'url d'une page HTML
function findGetParameter(parameterName) {
    var result = null,
            tmp = [];
    window.location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName)
            result = decodeURIComponent(tmp[1]);
    });
    return result;
}


function modifierExo() {

    //on récupère le code l'exercice
    var codeExo = findGetParameter("exomodfi");
    var alertediv = document.getElementById("alerte");
    //on récupère les champs des input
    var libExo = document.getElementById("idlib").value;
    var objExo = document.getElementById("idobj").value;
    var repetExo = document.getElementById("idrepet").value;
    var tpsExo = document.getElementById("idtps").value;
    var repoExo = document.getElementById("idrepo").value;
    var lienExo = document.getElementById("idlien").value;

    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.onload = function () {
                var xmlDoc = xhr.responseXML;
                //on récupère le message de la servlet via le xml
                var tabmessage = xmlDoc.getElementsByTagName("message");
                var textalert = tabmessage[0].childNodes[0].nodeValue;
                //on affiche le message a l'utilisateur
                alertediv.style.display = "block";
                alertediv.innerHTML = textalert;
            };
        }
    };

    xhr.open("GET", "" + IPCONFIG + "ServletModifierExo?code=" + codeExo + "&lib=" + libExo + "&obj=" + objExo + "&repet=" + repetExo + "&tps=" + tpsExo + "&repo=" + repoExo + "&lien=" + lienExo, true);
    xhr.send(null);
}


//-----------------------------------//
// insertion fct Thomas


function seanceRealis()
{

//Liste des profils associés au programme donné. 

    var xhr = getXMLHttpRequest();
    var idCli = sessionStorage.getItem('id');
    xhr.onreadystatechange = function ()

    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {

            var elt = document.getElementById("col-md-7");
            var xml = xhr.responseXML;
            // On récupère les libellés des profils
            var list = xml.getElementsByTagName("pasSeance");
            var valeur;

            var listeMessage = xml.getElementsByTagName("message");
            if (listeMessage.length !== 0)
            {
                var message = document.createTextNode(listeMessage[0].childNodes[0].nodeValue);
                var hd = document.createElement("h1");
                hd.append(message);
                elt.appendChild(hd);
            }


            //elt.innerHTML = "";
            for (var i = 0; i < list.length; i++) {
                // On ajoute sur la page le message d'erreur. 
                valeur = list[i].firstChild.nodeValue;
                var p1 = document.createElement("p");
                p1.append(valeur);
                elt.appendChild(p1);
//                elt.innerHTML = elt.innerHTML + valeur;
            }

            var listeCodee = xml.getElementsByTagName("codee");
            var listeLibellee = xml.getElementsByTagName("libellee");
            var listeLibelleeSeance = xml.getElementsByTagName("seanceType");
            var listeNbre = xml.getElementsByTagName("nbreP");
            var listeTemps = xml.getElementsByTagName("tempsP");
            var listeRepos = xml.getElementsByTagName("reposP");
            var listeSerie = xml.getElementsByTagName("reposP");
            for (var i = 0; i < listeCodee.length; i++) {
                // On ajoute sur la seance avec la liste des exercices. 

                var dl = document.createElement("dl");
                var dt = document.createElement("dt");
                var ddSerie = document.createElement("dd");
                var ddNbre = document.createElement("dd");
                var ddTemps = document.createElement("dd");
                var ddRepos = document.createElement("dd");


                //recuperation info de exo à l'indice i    
                sessionStorage.setItem('ex' + i, listeLibellee[i].childNodes[0].nodeValue);
                var libelle = document.createTextNode(listeLibellee[i].childNodes[0].nodeValue);
                var nbre = document.createTextNode(listeNbre[i].childNodes[0].nodeValue);
                var libelleSeance = document.createTextNode(listeLibelleeSeance[i].childNodes[0].nodeValue);
                var temps = document.createTextNode(listeTemps[i].childNodes[0].nodeValue);

                var repos = document.createTextNode(listeRepos[i].childNodes[0].nodeValue);
                var serie = document.createTextNode(listeSerie[i].childNodes[0].nodeValue);

                if (libelleSeance.data !== "bilan")
                {
                    dt.append(libelle);
                    ddSerie.append(serie);
                    ddNbre.append(nbre);
                    ddTemps.append(temps);
                    ddRepos.append(repos);

                    dl.append(dt);
                    dl.append(ddSerie);
                    dl.append(ddNbre);
                    dl.append(ddTemps);
                    dl.append(ddRepos);

                } else
                {
                    dt.append(libelle);
                    dl.append(dt);
                }
                elt.appendChild(dl);
            }


            if (list.length === 0) {

                var listeSession = xml.getElementsByTagName("seance");
                var session = listeSession[0].childNodes[0].nodeValue;
                sessionStorage.setItem('seance', session);
                var but = document.createElement("button");
                but.setAttribute("class", "btn btn-primary");
                if (libelleSeance.data !== "bilan") {
                    but.setAttribute("onclick", "window.location='RealisationSeance.html'");
                    but.append("C'est parti ! ");
                } else
                {
                    but.setAttribute("onclick", "window.location='RealisationSeanceBilan.html'");
                    but.append("Seance Bilan !");
                }
                dl.append(but);
            }
        }
    }
    ;
    // var params = "nomauteur = " + encodeURIcomponent(auteur)  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletSeanceDispo?idCli=" + idCli, true);
    xhr.send(null);

}


function ExerciceReal(i)
{

//Liste des profils associés au programme donné. 

    var xhr = getXMLHttpRequest();
    var idCli = sessionStorage.getItem('id');
    xhr.onreadystatechange = function ()

    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var zoneRepet = document.getElementById("resultat");
            zoneRepet.style.display = "none";
            compt = 1;

            var btnFinal = document.getElementById("finalisationExo");
            if (i !== 0) {
                while (btnFinal.firstChild) {
                    btnFinal.removeChild(btnFinal.firstChild);
                }
            }

            var elt = document.getElementById("col-md-7");
            var xml = xhr.responseXML;
            // On récupère les libellés des profils


            var zoneNomEx = document.getElementById("nomExo");
            while (zoneNomEx.firstChild) {
                zoneNomEx.removeChild(zoneNomEx.firstChild);
            }
            var listeLibellee = xml.getElementsByTagName("libellee");
            var valLib = listeLibellee[i].firstChild.nodeValue;
            var pnomexo = document.createElement("p");
            pnomexo.appendChild(document.createTextNode(valLib));
            zoneNomEx.appendChild(pnomexo);

            var zoneDescriEx = document.getElementById("DescripExo");
            while (zoneDescriEx.firstChild) {
                zoneDescriEx.removeChild(zoneDescriEx.firstChild);
            }
            var listeDescri = xml.getElementsByTagName("objectif");
            var valDescri = listeDescri[i].firstChild.nodeValue;
            var pnomDescri = document.createElement("p");
            pnomDescri.appendChild(document.createTextNode(valDescri));
            zoneDescriEx.appendChild(pnomDescri);

            var btnSerie = document.getElementById("nbRepetition");
            btnSerie.style.display = "block";

            var zoneSerie = document.getElementById("serie");
            while (zoneSerie.firstChild) {
                zoneSerie.removeChild(zoneSerie.firstChild);
            }
            var listeSerie = xml.getElementsByTagName("serieP");
            var valserie = listeSerie[i].firstChild.nodeValue;
            var pserie = document.createElement("p");
            pserie.appendChild(document.createTextNode(valserie));
            zoneSerie.appendChild(pserie);

            // zoneDescriEx.inherHTML = listeDescri[i].childNodes[0].nodeValue;

            var zoneReposEx = document.getElementById("tpsrepos");
            while (zoneReposEx.firstChild) {
                zoneReposEx.removeChild(zoneReposEx.firstChild);
            }
            var listeRepos = xml.getElementsByTagName("reposP");
            var valRepos = listeRepos[i].firstChild.nodeValue;
            var pnomRepos = document.createElement("p");
            pnomRepos.appendChild(document.createTextNode(valRepos));
            zoneReposEx.appendChild(pnomRepos);

            // zoneReposEx.inherHTML = listeRepos[i].childNodes[0].nodeValue;

            var zoneNbSerieEx = document.getElementById("nbSerie");

            while (zoneNbSerieEx.firstChild) {
                zoneNbSerieEx.removeChild(zoneNbSerieEx.firstChild);
            }
            var listeNbre = xml.getElementsByTagName("nbreP");
            var valSerieEx = listeNbre[i].firstChild.nodeValue;
            var pSerieEx = document.createElement("p");
            pSerieEx.appendChild(document.createTextNode(valSerieEx));
            zoneNbSerieEx.appendChild(pSerieEx);
//            zoneNbSerieEx.inherHTML = listeNbre[i].childNodes[0].nodeValue;

            var zoneTemps = document.getElementById("temps");
            while (zoneTemps.firstChild) {
                zoneTemps.removeChild(zoneTemps.firstChild);
            }
            var listeTemps = xml.getElementsByTagName("tempsP");
            var valTemps = listeTemps[i].firstChild.nodeValue;
            var pTemps = document.createElement("p");
            pTemps.appendChild(document.createTextNode(valTemps));
            zoneTemps.appendChild(pTemps);
//            zoneTemps.inherHTML = listeTemps[i].childNodes[0].nodeValue;

            var zoneVideo = document.getElementById("video");

            while (zoneVideo.firstChild) {
                zoneVideo.removeChild(zoneVideo.firstChild);
            }
            var listeVideo = xml.getElementsByTagName("lien");
            var valVideo = listeVideo[i].firstChild.nodeValue;
            zoneVideo.setAttribute("src", valVideo);
            var pvideo = document.createElement("p");
            pvideo.appendChild(document.createTextNode(valVideo));
            zoneVideo.appendChild(pvideo);

            var listedernierExo = xml.getElementsByTagName("max");
            var valdernierExo = listedernierExo[i].firstChild.nodeValue;


            //var listeCodee = xml.getElementsByTagName("codee");
            var zoneRepet = document.getElementById("repetitionEnCours");
            while (zoneRepet.firstChild) {
                zoneRepet.removeChild(zoneRepet.firstChild);
            }
            var valRepet = compt + "/" + valserie.substring(19);
            var pRepet = document.createElement("p");
            pRepet.appendChild(document.createTextNode(valRepet));
            zoneRepet.appendChild(pRepet);

            if (compt !== valserie.substring(19))
            {
                var zoneRepetition = document.getElementById("nbRepetition");
                while (zoneRepetition.firstChild) {
                    zoneRepetition.removeChild(zoneRepetition.firstChild);
                }
                var pButton = document.createElement("button");
                pButton.setAttribute("id", "btnFinal");
                pButton.setAttribute("class", "btn btn-primary");
                pButton.setAttribute("onclick", "incrementCompt(" + valserie.substring(19) + "," + i + "," + "\"" + valdernierExo + "\"" + ")");
                pButton.append("Prochaine série !");
                var pBut = document.createElement("p");
                pBut.append(pButton);
                zoneRepetition.appendChild(pBut);
            }
        }
    }
    ;
    // var params = "nomauteur = " + encodeURIcomponent(auteur)  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletSeanceDispo?idCli=" + idCli, true);
    xhr.send(null);

}
function incrementCompt(totRep, i, dernierExo) {
    var zoneEchau = document.getElementById("echauffement");
    zoneEchau.style.display = "none";
    compt++;
    var zoneRepet = document.getElementById("repetitionEnCours");
    while (zoneRepet.firstChild) {
        zoneRepet.removeChild(zoneRepet.firstChild);
    }
    var valRepet = compt + "/" + totRep;
    var pRepet = document.createElement("p");
    pRepet.appendChild(document.createTextNode(valRepet));
    zoneRepet.appendChild(pRepet);
    if (compt !== totRep)
    {
        zoneRepet.style.display = "block";

    } else {

        var zoneRepet = document.getElementById("resultat");
        zoneRepet.style.display = "block";
        var btnSerie = document.getElementById("nbRepetition");
        btnSerie.style.display = "none";

        var zoneButFinal = document.getElementById("finalisationExo");

        var pButton = document.createElement("button");
        pButton.setAttribute("class", "btn btn-primary");


        if (dernierExo === "faux")
        {
            pButton.setAttribute("onclick", "ExerciceReal(" + i + 1 + ") ;  AjouterBD(" + i + ")");
            pButton.append("Cloturer Exercice");

        } else
        {
            pButton.setAttribute("onclick", " AjouterBD(" + i + "); SeanceFini()");
            pButton.append("Cloturer la Séance !");
        }
        {
            var pBut = document.createElement("p");
            pBut.append(pButton);
            zoneButFinal.appendChild(pBut);
        }
    }
}

function SeanceFini()
{
    var nouvPage = document.getElementById("container");
    while (nouvPage.firstChild) {
        nouvPage.removeChild(nouvPage.firstChild);
    }
    var pserie = document.createElement("p");
    pserie.appendChild(document.createTextNode("Félicitation vous avez fini la séance! Etirement blablabla"));
    nouvPage.appendChild(pserie);
}
//function realEx(i)

function AjouterBD(a)
{

    var selectDifficult = document.getElementById("difficulte");
    var valSelect = selectDifficult.options[selectDifficult.selectedIndex].value;
    var sesActu = sessionStorage.getItem("seance");


    var xhr = getXMLHttpRequest();
    xhr.open("GET", "" + IPCONFIG + "ServletSeanceReal?diff=" + valSelect + "&sess=" + sesActu + "&ex=" + a, true);
    xhr.send(null);
}


function ExerciceRealBilan(i) {
    //Liste des profils associés au programme donné. 

    var xhr = getXMLHttpRequest();
    var idCli = sessionStorage.getItem('id');
    xhr.onreadystatechange = function ()

    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {

            var btnFinal = document.getElementById("finalisationExo");
            if (i !== 0) {
                while (btnFinal.firstChild) {
                    btnFinal.removeChild(btnFinal.firstChild);
                }
            }
            var xml = xhr.responseXML;
            // On récupère les libellés des profils

            var zoneNomEx = document.getElementById("nomExo");
            while (zoneNomEx.firstChild) {
                zoneNomEx.removeChild(zoneNomEx.firstChild);
            }
            var listeLibellee = xml.getElementsByTagName("libellee");
            var valLib = listeLibellee[i].firstChild.nodeValue;
            var pnomexo = document.createElement("p");
            pnomexo.appendChild(document.createTextNode(valLib));
            zoneNomEx.appendChild(pnomexo);
//            zoneNomEx.inherHTML =  valLib ;

            var zoneDescriEx = document.getElementById("DescripExo");
            while (zoneDescriEx.firstChild) {
                zoneDescriEx.removeChild(zoneDescriEx.firstChild);
            }
            var listeDescri = xml.getElementsByTagName("objectif");
            var valDescri = listeDescri[i].firstChild.nodeValue;
            var pnomDescri = document.createElement("p");
            pnomDescri.appendChild(document.createTextNode(valDescri));
            zoneDescriEx.appendChild(pnomDescri);


            var zoneVideo = document.getElementById("video");

            while (zoneVideo.firstChild) {
                zoneVideo.removeChild(zoneVideo.firstChild);
            }
            var listeVideo = xml.getElementsByTagName("lien");
            var valVideo = listeVideo[i].firstChild.nodeValue;
            zoneVideo.setAttribute("src", valVideo);
            var pvideo = document.createElement("p");
            pvideo.appendChild(document.createTextNode(valVideo));
            zoneVideo.appendChild(pvideo);

            var listedernierExo = xml.getElementsByTagName("max");
            var valdernierExo = listedernierExo[i].firstChild.nodeValue;

            var zoneRepet = document.getElementById("resultat");
            zoneRepet.style.display = "block";

            var zoneButFinal = document.getElementById("finalisationExo");
            zoneButFinal.style.display = "none";
            var pButton = document.createElement("submit");
            pButton.setAttribute("class", "btn btn-primary");
            if (valdernierExo === "faux")
            {
                pButton.setAttribute("onclick", "ExerciceRealBilan(" + i + 1 + ") ;  AjouterBDBilan(" + i + ")");
                pButton.append("Cloturer Exercice");

            } else
            {
                pButton.setAttribute("onclick", " AjouterBDBilan(" + i + "); SeanceFini()");
                pButton.append("Cloturer la Séance !");
            }
            zoneButFinal.appendChild(pButton);

        }
    }
    ;
    // var params = "nomauteur = " + encodeURIcomponent(auteur)  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletSeanceDispo?idCli=" + idCli, true);
    xhr.send(null);

}

function AjouterBDBilan(i)
{
    var zoneEchau = document.getElementById("echauffement");
    zoneEchau.style.display = "none";
    var valresultat = document.getElementById("valresultat");
    var valSelect = valresultat.value;
    var sesActu = sessionStorage.getItem("seance");


    var xhr = getXMLHttpRequest();
    xhr.open("GET", "" + IPCONFIG + "ServletSeanceRealBilan?diff=" + valSelect + "&sess=" + sesActu + "&ex=" + i, true);
    xhr.send(null);
}

function checkValeur(valeur) {
    var zoneButFinal = document.getElementById("finalisationExo");
    if (valeur === "")
    {
        zoneButFinal.style.display = "none";
    } else
    {
        zoneButFinal.style.display = "block";
    }
}


//----------------------------------------------------------------//
// ajout ELODIE



function afficherSeancesTypes() {

//on récupère des séances types et on les affiche dans une liste 

    var listeSeanceType = document.getElementById("selectSeanceType");

    var boutonDuppliquer = document.getElementById("btnDuppliquerST");
    boutonDuppliquer.setAttribute("onclick", "duppliquerSeance()");

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();

    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            xmlDoc = xhr.responseXML;

            // recupere les infos des balises Code et libelle de Seance Type
            var listeCodest = xmlDoc.getElementsByTagName("Codest");
            var listeLibellest = xmlDoc.getElementsByTagName("Libellest");

            //on parcours le tableau reçu et on rajoute un élément option pour chaque séance trouvée
            for (var i = 0; i < listeCodest.length; i++)
            {
                var optionSeanceType = document.createElement("option");
                optionSeanceType.appendChild(document.createTextNode(listeLibellest[i].childNodes[0].nodeValue));
                optionSeanceType.setAttribute("value", listeCodest[i].childNodes[0].nodeValue);
                listeSeanceType.appendChild(optionSeanceType);
            }
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletGetAllSeance", true);
    xhr.send(null);
}


function duppliquerSeance() {
//on récupère les éléments nécéssaires à la dupplication de la séance type

    var listselected = document.getElementById("selectSeanceType");
    var codeSeanceType = listselected.value;
    var boutonDuppliquer = document.getElementById("btnDuppliquerST");
    var pCodeU = findGetParameter("pCodeU");
    var pCodeP = findGetParameter("pCodeP");


    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            xmlDoc = xhr.responseXML;


            //on récupère les noeuds libelle et description et on ajoute un formulaire reprenant les valeurs des noeuds
            var libelleSeanceType = xmlDoc.getElementsByTagName("libelle");
            var descriptionSeanceType = xmlDoc.getElementsByTagName("description");
            var codeSeancePersotab = xmlDoc.getElementsByTagName("code");

            var txtlibelle = libelleSeanceType[0].childNodes[0].nodeValue;
            var txtdescription = descriptionSeanceType[0].childNodes[0].nodeValue;
            var codeSeancePerso = codeSeancePersotab[0].childNodes[0].nodeValue;

            //on récupère le div et on lui assigne les éléments de formulaire
            var divModification = document.getElementById("divModification");
            var formPersonnaliser = document.createElement("form");

            var divformGrouplibelle = document.createElement("div");
            divformGrouplibelle.setAttribute("class", "form-group");

            var labelLibelle = document.createElement("label");
            labelLibelle.setAttribute("for", "inputLibelleS");
            labelLibelle.appendChild(document.createTextNode("Modifier le libellé de la séance"));

            var inputLibelle = document.createElement("input");
            inputLibelle.setAttribute("value", txtlibelle);
            inputLibelle.setAttribute("id", "inputLibelleS");
            inputLibelle.setAttribute("class", "form-control");

            divformGrouplibelle.appendChild(labelLibelle);
            divformGrouplibelle.appendChild(inputLibelle);

            var divformGroupdescription = document.createElement("div");
            divformGroupdescription.setAttribute("class", "form-group");

            var labelDescription = document.createElement("label");
            labelDescription.setAttribute("for", "inputDescriptionS");
            labelDescription.appendChild(document.createTextNode("Modifier la description de la séance"));

            var inputDescription = document.createElement("input");
            inputDescription.setAttribute("value", txtdescription);
            inputDescription.setAttribute("id", "inputDescriptionS");
            inputDescription.setAttribute("class", "form-control");
            inputDescription.setAttribute("type", "text");

            divformGroupdescription.appendChild(labelDescription);
            divformGroupdescription.appendChild(inputDescription);


            var divformGroupNombreRep = document.createElement("div");
            divformGroupNombreRep.setAttribute("class", "form-group");

            var labelNbRep = document.createElement("label");
            labelNbRep.setAttribute("for", "inputinputNbRepS");
            labelNbRep.appendChild(document.createTextNode("Indiquer le nombre de répétitions de la séance"));

            var inputNbRep = document.createElement("input");
            inputNbRep.setAttribute("id", "inputinputNbRepS");
            inputNbRep.setAttribute("class", "form-control");
            inputNbRep.setAttribute("value", "2");
            inputNbRep.setAttribute("type", "number");

            divformGroupNombreRep.appendChild(labelNbRep);
            divformGroupNombreRep.appendChild(inputNbRep);


            var divformGroupNumSemaine = document.createElement("div");
            divformGroupNumSemaine.setAttribute("class", "form-group");

            var labelNumSemaine = document.createElement("label");
            labelNumSemaine.setAttribute("for", "inputNumSemaine");
            labelNumSemaine.appendChild(document.createTextNode("Indiquer le numéro de la semaine"));

            var inputNumSemaine = document.createElement("input");
            inputNumSemaine.setAttribute("id", "inputNumSemaine");
            inputNumSemaine.setAttribute("class", "form-control");
            inputNumSemaine.setAttribute("type", "number");
            inputNumSemaine.setAttribute("value", "0");

            divformGroupNumSemaine.appendChild(labelNumSemaine);
            divformGroupNumSemaine.appendChild(inputNumSemaine);




            var inputModifier = document.createElement("input");
            inputModifier.setAttribute("value", "Modifier");
            inputModifier.setAttribute("type", "button");
            inputModifier.setAttribute("onclick", "  modififierSeancePerso()");
            inputModifier.setAttribute("class", "btn btn-primary btn-xs");


            var alerteModif = document.createElement("small");
            alerteModif.setAttribute("id", "alerteModif");

            formPersonnaliser.appendChild(divformGrouplibelle);
            formPersonnaliser.appendChild(divformGroupdescription);
            formPersonnaliser.appendChild(divformGroupNombreRep);
            formPersonnaliser.appendChild(divformGroupNumSemaine);


            formPersonnaliser.appendChild(inputModifier);
            formPersonnaliser.appendChild(alerteModif);

            divModification.appendChild(formPersonnaliser);

            //au click du bouton les éléments du formulaire ne sont plus clickables

            listselected.disabled = true;
            boutonDuppliquer.disabled = true;

            document.getElementById("inputHiddenSeancePerso").value = codeSeancePerso;

            //on affiche les exercices de la séance nouvellemenet créée (duppliqués de la séance type
            afficherExoSeancePerso();
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletCreerSeancePerso?pcodeSeanceType=" + codeSeanceType + "&pCodeU=" + pCodeU + "&pCodeP=" + pCodeP, true);
    xhr.send(null);
}


function afficherExoSeancePerso() {

    //on récupère les éléments nous permettant d'afficher les exercices
    var codeSeance = document.getElementById("inputHiddenSeancePerso").value;

    var divPersonnaliser = document.getElementById("divPersonnaliser");
    divPersonnaliser.innerHTML = "";

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {

            // Elément html que l'on va mettre à jour.
            xmlDoc = xhr.responseXML;

            var exerciceCodes = xmlDoc.getElementsByTagName("code");

            var exerciceLibelles = xmlDoc.getElementsByTagName("exercice_libelle");
            var exerciceObjectifs = xmlDoc.getElementsByTagName("objectif");

            for (var i = 0; i < exerciceCodes.length; i++) {

                //pour chaque exercice trouvé, on les affiche et on leur assigne un bouton de suppression
                var code = exerciceCodes[i].childNodes[0].nodeValue;

                var libelle = exerciceLibelles[i].childNodes[0].nodeValue;

                var objectif = exerciceObjectifs[i].childNodes[0].nodeValue;

                //on créé un élement option auquel on assoucie la valeur du noeud exercice libellé
                var dtlibelle = document.createElement("dt");
                dtlibelle.appendChild(document.createTextNode(libelle));
                dtlibelle.setAttribute("class", "col-sm-3");

                var ddobjectif = document.createElement("dd");
                ddobjectif.appendChild(document.createTextNode(objectif));
                ddobjectif.setAttribute("class", "col-sm-9");

                //creation input nombre de répétitions de l'exercice
                var ddModifierNbRep = document.createElement("dd");

                var labelModifierRep = document.createElement("label");
                labelModifierRep.appendChild(document.createTextNode("Nombre de répétitions"));
                labelModifierRep.setAttribute("for", "inputModifierREp" + code);
                var inputModifierRep = document.createElement("input");
                inputModifierRep.setAttribute("id", "inputModifierREp" + code);
                inputModifierRep.setAttribute("type", "number");
                inputModifierRep.setAttribute("value", "0");



                ddModifierNbRep.appendChild(labelModifierRep);
                ddModifierNbRep.appendChild(inputModifierRep);

                //creation input temps de l'exercice

                var ddModifierTempsE = document.createElement("dd");

                var labelModifierTempsE = document.createElement("label");
                labelModifierTempsE.appendChild(document.createTextNode("Temps de l'exercice (en secondes)"));
                labelModifierTempsE.setAttribute("for", "inputModifierTempsE" + code);
                var inputModifierTempsE = document.createElement("input");
                inputModifierTempsE.setAttribute("id", "inputModifierTempsE" + code);
                inputModifierTempsE.setAttribute("type", "number");
                inputModifierTempsE.setAttribute("value", "0");


                ddModifierTempsE.appendChild(labelModifierTempsE);
                ddModifierTempsE.appendChild(inputModifierTempsE);

                //creation input temps de repos
                var ddModifierTempsRepos = document.createElement("dd");

                var labelModifierTempsRepos = document.createElement("label");
                labelModifierTempsRepos.appendChild(document.createTextNode("Temps de repos de l'exercice (en secondes)"));
                labelModifierTempsRepos.setAttribute("for", "inputModifierTempsRepos" + code);
                var inputModifierTempsRepos = document.createElement("input");
                inputModifierTempsRepos.setAttribute("id", "inputModifierTempsRepos" + code);
                inputModifierTempsRepos.setAttribute("type", "number");
                inputModifierTempsRepos.setAttribute("value", "0");

                ddModifierTempsRepos.appendChild(labelModifierTempsRepos);
                ddModifierTempsRepos.appendChild(inputModifierTempsRepos);

                //creation bouton modification

                var ddBoutonModifierPlanifier = document.createElement("dd");
                var boutonModifierPlanifier = document.createElement("input");
                boutonModifierPlanifier.setAttribute("class", "btn btn-primary btn-xs");
                boutonModifierPlanifier.setAttribute("value", "Modifier");
                boutonModifierPlanifier.setAttribute("onclick", "modifierPlanifier(" + code + ")");
                ddBoutonModifierPlanifier.appendChild(boutonModifierPlanifier);

                //creation du message d'alerte

                var ddMessageAlerte = document.createElement("dd");
                var messageAlerte = document.createElement("small");

                messageAlerte.setAttribute("value", "Modifier");
                messageAlerte.setAttribute("id", "alerteExo" + code);

                ddMessageAlerte.appendChild(messageAlerte);



//affectation dans le dl
                var dlrow = document.createElement("dl");
                dlrow.setAttribute("class", "row");
                dlrow.appendChild(dtlibelle);
                dlrow.appendChild(ddobjectif);
                dlrow.appendChild(ddModifierNbRep);
                dlrow.appendChild(ddModifierTempsE);
                dlrow.appendChild(ddModifierTempsRepos);
                dlrow.appendChild(ddBoutonModifierPlanifier);
                dlrow.appendChild(ddMessageAlerte);


                dlrow.setAttribute("id", "iddl" + code);

                divPersonnaliser.appendChild(dlrow);

                var suppExoSeancePerso = document.createElement("input");
                suppExoSeancePerso.setAttribute("onclick", "suppression_ExoSeancePerso(" + code + "," + codeSeance + ")");
                suppExoSeancePerso.setAttribute("value", "Supprimer");
                suppExoSeancePerso.setAttribute("class", "btn btn-primary btn-xs");
                suppExoSeancePerso.setAttribute("type", "button");


                var separation = document.createElement("hr");
                separation.setAttribute("id", "idsep" + code);
                dlrow.appendChild(suppExoSeancePerso);
                divPersonnaliser.appendChild(separation);

            }
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletAfficherExercicesSeancePerso?pcodeSeancePerso=" + codeSeance);
    xhr.send(null);

//on permet a l'utilisateur de rajouter un nouvel exercice via un formulaire
    var ajouterExoSeancePersoLabel = document.createElement("label");
    ajouterExoSeancePersoLabel.setAttribute("for", "selectNouveauExo");
    ajouterExoSeancePersoLabel.appendChild(document.createTextNode("Ajouter un nouvel exercice à cette séance"));

    var ajouterExoSeancePersoList = document.createElement("select");
    ajouterExoSeancePersoList.setAttribute("id", "selectNouveauExo");
    ajouterExoSeancePersoList.setAttribute("class", "form-control");

    var divFormGroupAjout = document.createElement("div");
    divFormGroupAjout.setAttribute("class", "form-group");
    divFormGroupAjout.appendChild(ajouterExoSeancePersoLabel);
    divFormGroupAjout.appendChild(ajouterExoSeancePersoList);

    var formAlertAjout = document.createElement("small");
    formAlertAjout.setAttribute("id", "formAlertAjout");
    divPersonnaliser.appendChild(formAlertAjout);

    divPersonnaliser.appendChild(divFormGroupAjout);

    var ajouterExoSeancePersoList = document.createElement("input");
    ajouterExoSeancePersoList.setAttribute("onclick", "ajouterExerciceSeance()");
    ajouterExoSeancePersoList.setAttribute("value", "Ajouter");
    ajouterExoSeancePersoList.setAttribute("class", "btn btn-primary btn-xs");

    divPersonnaliser.appendChild(ajouterExoSeancePersoList);

//on appelle de nouveau la fonction de visualisation des exercices pour la mettre a jour
    visualiserExercicesNotInSeance();

}

//fonction de suppression d'un exercice pour une séance personnalisée
function suppression_ExoSeancePerso(codeExercice, codeSeance) {
    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            document.getElementById("iddl" + codeExercice).innerHTML = "";
            document.getElementById("idsep" + codeExercice).remove();


            //on appelle de nouveau la fonction de visualisation des exercices pour la mettre a jour
            visualiserExercicesNotInSeance();
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletSupprimerExerciceSeancePerso?pExoSupp=" + codeExercice + "&pCodeSeance=" + codeSeance);
    xhr.send(null);
}


//fonction permettant d'afficher les exerices n'étant pas encore affecté à une séance personnalisée donnée
function visualiserExercicesNotInSeance() {

    var codeSeance = document.getElementById("inputHiddenSeancePerso");
    document.getElementById("selectNouveauExo").innerHTML = "";
    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            xmlDoc = xhr.responseXML;

            var exerciceCodes = xmlDoc.getElementsByTagName("code");

            var exerciceLibelles = xmlDoc.getElementsByTagName("exercice_libelle");


            for (var i = 0; i < exerciceCodes.length; i++) {

                //pour chaque exercice trouvé on le rajoute dans la liste de choix
                var code = exerciceCodes[i].childNodes[0].nodeValue;

                var libelle = exerciceLibelles[i].childNodes[0].nodeValue;

                var optExercice = document.createElement("option");
                optExercice.appendChild(document.createTextNode(libelle));
                optExercice.setAttribute("value", code);

                document.getElementById("selectNouveauExo").appendChild(optExercice);

            }
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletExercicesNotInSeance?pCodeSeance=" + codeSeance.value);
    xhr.send(null);

}

//fonction permettant d'ajouter un nouvel exercice à une séance personnalisée
function ajouterExerciceSeance() {

    var codeSeance = document.getElementById("inputHiddenSeancePerso");
    var listselected = document.getElementById("selectNouveauExo");

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            xmlDoc = xhr.responseXML;


            var alerteAjout = document.getElementById("formAlertAjout");
            var messageTableau = xmlDoc.getElementsByTagName("message");
            alerteAjout.innerHTML = messageTableau[0].childNodes[0].nodeValue;


            //on appelle de nouveau la fonction de visualisation des exercices de la séance personnalisée pour l'actualiser  
            afficherExoSeancePerso();
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletAjouterExerciceSeance?pCodeSeance=" + codeSeance.value + "&pCodeExercice=" + listselected.value);
    xhr.send(null);


}

//fonction permettant la modification des champs d'une séance personnalisée
function modififierSeancePerso() {

    var codeSeance = document.getElementById("inputHiddenSeancePerso");
    var inputDescription = document.getElementById("inputDescriptionS");
    var inputLibelle = document.getElementById("inputLibelleS");
    var inputNbRep = document.getElementById("inputinputNbRepS");
    var inputNumSemaine = document.getElementById("inputNumSemaine");



    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            xmlDoc = xhr.responseXML;
            var alerteModif = document.getElementById("alerteModif");
            var messageTableau = xmlDoc.getElementsByTagName("message");
            alerteModif.innerHTML = messageTableau[0].childNodes[0].nodeValue;

        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletModifierSeancePerso?pCodeS=" + codeSeance.value + "&plibelleSeance=" + inputLibelle.value + "&pdescriptionSeance=" + inputDescription.value + "&pNbRepSeance=" + inputNbRep.value + "&pNumSemaine=" + inputNumSemaine.value);
    xhr.send(null);


}

//fonction permettant la modification des champs d'une séance personnalisée
function modifierPlanifier(codeExo) {

    var codeSeance = document.getElementById("inputHiddenSeancePerso");
    var inputModifierRep = document.getElementById("inputModifierREp" + codeExo);
    var inputModifierTempsE = document.getElementById("inputModifierTempsE" + codeExo);
    var inputModifierTempsRepos = document.getElementById("inputModifierTempsRepos" + codeExo);



    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            xmlDoc = xhr.responseXML;

            var messageTableau = xmlDoc.getElementsByTagName("message");

            var alerteExo = document.getElementById("alerteExo" + codeExo);
            alerteExo.innerHTML = messageTableau[0].childNodes[0].nodeValue;

        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletModifierPlanifier?pCodeS=" + codeSeance.value + "&pCodeExo=" + codeExo + "&pRepetition=" + inputModifierRep.value + "&pTempsE=" + inputModifierTempsE.value + "&pTempsRepos=" + inputModifierTempsRepos.value);
    xhr.send(null);


}


///---------------------------------------------
// AJOUT fonction DAMIEN



//recupere  et affiche tous les utilisateurs de la BDD.
function getAllUtilisateur() {
    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            elt = xhr.responseXML;

            // recupere les infos des balises nomU, prenomU, codeU et statutU
            var listeNom = elt.getElementsByTagName("nomU");
            var listePrenom = elt.getElementsByTagName("prenomU");
            var listecodeU = elt.getElementsByTagName("codeU");
            var listeStatutU = elt.getElementsByTagName("statutU");

            // recupere la zone d'insertion
            div = document.getElementById("listeUtilisateur");
            //div.innerHTML = "";

            //creation de l'entete d'un tableau
            var table = document.createElement("table");
            table.className = "table ";
            var thead = document.createElement("thead");
            thead.className = "thead-dark";
            var tbody = document.createElement("tbody");
            var headRow = document.createElement("tr");
            ["Client", "Statut"].forEach(function (el) {
                var th = document.createElement("th");
                th.scope = "col";
                th.appendChild(document.createTextNode(el));
                headRow.appendChild(th);
            });
            thead.appendChild(headRow);
            table.appendChild(thead);

            //Parcours la liste des prenoms, creation d'une liste, concatene nom + prenom et ajoute a la liste.
            for (var i = 0; i < listePrenom.length; i++)
            {

                // creation d'un href
                var a = document.createElement("a");
                a.href = '/backendinte/Clientselected.html?client=' + listecodeU[i].childNodes[0].nodeValue;
                a.innerHTML = listeNom[i].childNodes[0].nodeValue + " " + listePrenom[i].childNodes[0].nodeValue;

                //
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.appendChild(a);
                tr.appendChild(td);
                tbody.appendChild(tr);

                var td2 = document.createElement("td");
                td2.appendChild(document.createTextNode(listeStatutU[i].childNodes[0].nodeValue));

                tr.appendChild(td2);
                tbody.appendChild(tr);
                table.appendChild(tbody);
                div.appendChild(table);
            }
            var spanNbClients = document.getElementById("nbclients");


            spanNbClients.innerHTML = listecodeU.length;

        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletGetAllClients", true);
    xhr.send(null);
}

//-----------recupere toutes les SEANCES-------------------//

// recuperer et affiche toutes les seances
function getAllSeance() {

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            elt = xhr.responseXML;

            // recupere les infos des balises nomU, prenomU, codeU et statutU
            var listeCodest = elt.getElementsByTagName("Codest");
            var listeDescripst = elt.getElementsByTagName("Descripst");
            var listeLibellest = elt.getElementsByTagName("Libellest");

            // recupere la zone d'insertion
            var divS = document.getElementById("listeSeance");
            divS.innerHTML = "";

            //Parcours la liste des prenoms, creation d'une liste, concatene nom + prenom et ajoute a la liste.
            for (var i = 0; i < listeCodest.length; i++)
            {
                // mise en forme titre -- description
                var dl = document.createElement("dl");
                var dt = document.createElement("dt");
                dt.setAttribute("class", "col-sm-3");
                var dd = document.createElement("dd");
                dd.setAttribute("class", "col-sm-9");
                //creation d'une div pour que la fct js getExerciceForSeanceType
                //ajoute les exercices dans la div
                var ddDiv = document.createElement("dd");


                // div comportant id code+libelle du seance 
                var divExo = document.createElement("div");
                divExo.id = listeCodest[i].childNodes[0].nodeValue + listeLibellest[i].childNodes[0].nodeValue;
                var hr = document.createElement("hr");

                //description de l'exercice           
                var description = document.createTextNode(listeDescripst[i].childNodes[0].nodeValue);
                //libelle du programme avec un Href
                var a = document.createElement("a");
                a.href = 'backend/modifierSeance.html&code=' + listeCodest[i].childNodes[0].nodeValue;
                a.innerHTML = listeLibellest[i].childNodes[0].nodeValue;
                a.style.color = "#8b0000";

                
                dt.append(a);
                

                dd.append(description);
                ddDiv.append(divExo);


                dl.append(dt);
                dl.append(dd);
                dl.append(ddDiv);

                divS.append(dl);
                getExerciceForSeanceType(listeCodest[i].childNodes[0].nodeValue, listeCodest[i].childNodes[0].nodeValue + listeLibellest[i].childNodes[0].nodeValue);

            }
        }
    };
    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletGetAllSeance", true);
    xhr.send(null);
}

// recuperer et affiche les exercices pour une seance type
function getExerciceForSeanceType(p_codest, p_idDiv) {

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            elt = xhr.responseXML;

            // recupere les infos du XML.
            var listeCodee = elt.getElementsByTagName("codee");
            var listeCategorie = elt.getElementsByTagName("codecat");
            var listeLibellee = elt.getElementsByTagName("libellee");
            var listeObjectif = elt.getElementsByTagName("objectif");
            var listeLien = elt.getElementsByTagName("lien");
            var listeNbre = elt.getElementsByTagName("nbre");
            var listeTemps = elt.getElementsByTagName("temps");
            var listeRepos = elt.getElementsByTagName("repos");

            // recupere la zone d'insertion dans le .HTML
            div = document.getElementById(p_idDiv);
            div.innerHTML = "";

            //Parcours la liste 
            for (var i = 0; i < listeCodee.length; i++)
            {
                // mise en forme titre -- description

                var dl = document.createElement("dl");
                var dt = document.createElement("dt");
                var ddNbre = document.createElement("dd");
                var ddTemps = document.createElement("dd");
                var ddRepos = document.createElement("dd");

                var hr = document.createElement("hr");

                //recuperation info de exo à l'indice i    
                var libelle = document.createTextNode(listeLibellee[i].childNodes[0].nodeValue);
                var nbre = document.createTextNode(listeNbre[i].childNodes[0].nodeValue);
                var temps = document.createTextNode(listeTemps[i].childNodes[0].nodeValue);
                var repos = document.createTextNode(listeRepos[i].childNodes[0].nodeValue);

                dt.append(libelle);
                ddNbre.append(nbre);
                ddTemps.append(temps);
                ddRepos.append(repos);

                dl.append(dt);
                dl.append(ddNbre);
                dl.append(ddTemps);
                dl.append(ddRepos);

                div.appendChild(dl);
            }
        }
    };

    // var params = "codeS = " + code de la seance  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletGetExoForSeanceT?codeS=" + p_codest, true);
    xhr.send(null);
}

//-------------recupere tous les PROGRAMMES-----------------//

// recuperer et affiche tous les programmes
function getAllProgramme() {
    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // Elément html que l'on va mettre à jour.
            elt = xhr.responseXML;

            // recupere les infos des balises codeP, Descriptionp, Libellep
            var listeCodep = elt.getElementsByTagName("Codep");
            var listeDescriptionp = elt.getElementsByTagName("Descriptionp");
            var listeLibellep = elt.getElementsByTagName("Libellep");

            // recupere la zone d'insertion dans le .HTML
            div = document.getElementById("listeProgramme");
            div.innerHTML = "";

            //Parcours la liste des prenoms, creation d'une liste, concatene nom + prenom et ajoute a la liste.
            for (var i = 0; i < listeCodep.length; i++)
            {
                // mise en forme titre -- description
                var dl = document.createElement("dl");
                var dt = document.createElement("dt");
                dt.setAttribute("class", "col-sm-3");
                var dd = document.createElement("dd");
                dd.setAttribute("class", "col-sm-9");
                // div comportant id code du programme 
                var divprofil = document.createElement("div");
                divprofil.id = listeCodep[i].childNodes[0].nodeValue;
                var ddProfil = document.createElement("dd");
                //creation d'une div pour que la fct js getExerciceForSeanceType
                //ajoute les exercices dans la div
                var ddDiv = document.createElement("dd");


                // div comportant id code+libelle du seance 
                var divExo = document.createElement("div");
                divExo.id = listeCodep[i].childNodes[0].nodeValue + listeLibellep[i].childNodes[0].nodeValue;
                var hr = document.createElement("hr");



                //description du proramme           
                var description = document.createTextNode(listeDescriptionp[i].childNodes[0].nodeValue);
                //libelle du programme avec un Href
                var a = document.createTextNode(listeLibellep[i].childNodes[0].nodeValue);
                dt.append(a);
                dd.append(description);
                ddProfil.append(divprofil);
                ddDiv.append(divExo);

                dl.append(dt);
                dl.append(dd);
                dl.append(ddProfil);
                dl.append(ddDiv);

                div.appendChild(dl);

                div.append(hr);
                getSeanceForProgramme(listeCodep[i].childNodes[0].nodeValue, listeCodep[i].childNodes[0].nodeValue + listeLibellep[i].childNodes[0].nodeValue);
                listeProfil(listeCodep[i].childNodes[0].nodeValue);
            }
        }
    };

    // Requête au serveur avec les paramètres éventuels.
    xhr.open("GET", "" + IPCONFIG + "ServletGetAllProgramme", true);
    xhr.send(null);
}


// recuperer et affiche la lsite des profils pour un programmes
function listeProfil(p_prog)
{
//Liste des profils associés au programme donné. 

    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function ()

    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {

            var elt = document.getElementById(p_prog);
            var xml = xhr.responseXML;
            // On récupère les libellés des profils
            var list = xml.getElementsByTagName("profilLib");
            var valeur;

            //elt.innerHTML = "";
            for (var i = 0; i < list.length; i++) {
                // On ajoute sur la page les profils. 
                valeur = list[i].firstChild.nodeValue;
                elt.innerHTML = elt.innerHTML + valeur;
            }
        }
    }
    ;
    // var params = "nomauteur = " + encodeURIcomponent(auteur)  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletProfilProg?prog=" + p_prog, true);
    xhr.send(null);
}


// var params = p_code : pour la requete hql de la servlet.
// var parrams = p_idDiv : pour recuperer l'id de la div du html.
// recuperer et affiche les seances pour un programmes
function getSeanceForProgramme(p_code, p_idDiv) {
    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var elt = xhr.responseXML;


            // recupere les infos du XML.
            var listeCodest = elt.getElementsByTagName("Codest");
            var listeDescripst = elt.getElementsByTagName("Descripst");
            var listeLibellest = elt.getElementsByTagName("Libellest");
            // recupere la zone d'insertion dans le .HTML
            var div = document.getElementById(p_idDiv);
            div.innerHTML = "";

            //Parcours la liste 
            for (var i = 0; i < listeCodest.length; i++)
            {
                // mise en forme titre -- description
                var dl = document.createElement("dl");
                var dt = document.createElement("dt");
                var dd = document.createElement("dt");

                var hr = document.createElement("hr");


                //recuperation libelle   
                var libelle = document.createTextNode(listeLibellest[i].childNodes[0].nodeValue);
                //recuperation description
                var description = document.createTextNode(listeDescripst[i].childNodes[0].nodeValue);
                console.log("elt", libelle);
                if (listeLibellest[i].childNodes[0].nodeValue === "bilan") {
                    dl.style.color = "Red";
                }
                dt.append(libelle);
                dd.append(description);

                dl.append(dt);
                dl.append(dd);

                div.appendChild(dl);
            }
        }
    };

    // var params = "codeP = " + code du programme  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletGetSeanceForProgramme?codeP=" + p_code, true);
    xhr.send(null);
}


// Inserer des info personel d'un client dan sl ap page client selected
function getInfoPersoClient() {
    var client = findGetParameter('client');

    // Objet XMLHttpRequest.
    var xhr = getXMLHttpRequest();
    // On précise ce que l'on va faire quand on aura reçu la réponse du serveur.
    xhr.onreadystatechange = function ()
    {
        // Si l'on a tout reçu et que la requête http s'est bien passée.
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var elt = xhr.responseXML;


            // recupere les infos des balises nomU, prenomU....
            var listeNomU = elt.getElementsByTagName("nomU");
            var listePrenomU = elt.getElementsByTagName("prenomU");
            var listeGenreU = elt.getElementsByTagName("genreU");
            var listeNaissU = elt.getElementsByTagName("datenaissanceU");
            var listeStatutU = elt.getElementsByTagName("statutU");
            var listeAdresseU = elt.getElementsByTagName("adresseU");
            var listeProfilU = elt.getElementsByTagName("profilU");
            var listeTelU = elt.getElementsByTagName("telU");
            var listeMailU = elt.getElementsByTagName("mailU");


            var dl = document.getElementById("infoPersoClient");

            // affichage du libellé nom et du nom du client proprement
            var dtNom = document.createElement("dt");
            dtNom.setAttribute("class", "col-sm-3");
            dtNom.appendChild(document.createTextNode("Nom"));
            var ddNom = document.createElement("dd");
            var nom = document.createTextNode(listeNomU[0].childNodes[0].nodeValue);
            ddNom.append(nom);
            ddNom.setAttribute("class", "col-sm-9");
            dl.append(dtNom);
            dl.append(ddNom);

            // affichage du libellé XXXX et du XXXX du client proprement
            var dtPrenom = document.createElement("dt");
            dtPrenom.setAttribute("class", "col-sm-3");
            dtPrenom.appendChild(document.createTextNode("Prenom"));
            var ddPrenom = document.createElement("dd");
            var Prenom = document.createTextNode(listePrenomU[0].childNodes[0].nodeValue);
            ddPrenom.append(Prenom);
            ddPrenom.setAttribute("class", "col-sm-9");
            dl.append(dtPrenom);
            dl.append(ddPrenom);

            // affichage du libellé XXXX et du XXXX du client proprement
            var dtGenre = document.createElement("dt");
            dtGenre.setAttribute("class", "col-sm-3");
            dtGenre.appendChild(document.createTextNode("Genre"));
            var ddGenre = document.createElement("dd");
            var Genre = document.createTextNode(listeGenreU[0].childNodes[0].nodeValue);
            ddGenre.append(Genre);
            ddGenre.setAttribute("class", "col-sm-9");
            dl.append(dtGenre);
            dl.append(ddGenre);

            // affichage du libellé XXXX et du XXXX du client proprement
            var dtAge = document.createElement("dt");
            dtAge.setAttribute("class", "col-sm-3");
            dtAge.appendChild(document.createTextNode("Naissance"));
            var ddAge = document.createElement("dd");
            var Age = document.createTextNode(listeNaissU[0].childNodes[0].nodeValue);
            ddAge.append(Age);
            ddAge.setAttribute("class", "col-sm-9");
            dl.append(dtAge);
            dl.append(ddAge);

            // affichage du libellé XXXX et du XXXX du client proprement
            var dtAdresse = document.createElement("dt");
            dtAdresse.setAttribute("class", "col-sm-3");
            dtAdresse.appendChild(document.createTextNode("Adresse"));
            var ddAdresse = document.createElement("dd");
            var Adresse = document.createTextNode(listeAdresseU[0].childNodes[0].nodeValue);
            ddAdresse.append(Adresse);
            ddAdresse.setAttribute("class", "col-sm-9");
            dl.append(dtAdresse);
            dl.append(ddAdresse);

            // affichage du libellé XXXX et du XXXX du client proprement
            var dtMail = document.createElement("dt");
            dtMail.setAttribute("class", "col-sm-3");
            dtMail.appendChild(document.createTextNode("Mail"));
            var ddMail = document.createElement("dd");
            var Mail = document.createTextNode(listeMailU[0].childNodes[0].nodeValue);
            ddMail.append(Mail);
            ddMail.setAttribute("class", "col-sm-9");
            dl.append(dtMail);
            dl.append(ddMail);

        }
    };

    // var params = "codeP = " + code du programme  ; 
    xhr.open("GET", "" + IPCONFIG + "ServletGetOneClient?client=" + client, true);
    xhr.send(null);
}



//Recupere le paramatre de l'url d'une page HTML
function findGetParameter(parameterName) {
    var result = null,
            tmp = [];
    window.location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName)
            result = decodeURIComponent(tmp[1]);
    });
    return result;
}
