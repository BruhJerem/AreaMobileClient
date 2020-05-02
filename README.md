
# AREA - Application Mobile

## Le projet

L'objectif du projet AREA est de créer une plateforme mobile ainsi qu'une plateforme Web qui se rapproche de <https://bit.ly/RyssJ8.>

**Zapier** permet l'inter-connexion de plusieurs services. AREA permet la même chose, repenser à notre manière, de façon simple.

## L'équipe

Nous sommes une équipe de 2 développeurs à avoir travaillé sur l'application mobile AREA.

Jérémie Bruhwiller & Pierre-Antoine Franck.
Nous nous sommes répartis les tâches équitablement afin de rendre un projet cohérent.
En plus du développement, nous nous sommes occupés de l'UI/UX de l'application afin de la rendre agréable et intuitive.

@pierreafranck
@bruhwiller_jerem

## IPA & APK

Si vous souhaitez utiliser notre application, une simple demande auprès d'un membre de l'équipe (via twitter par exemple) vous permettra de l'utiliser. Nous vous fournirons le package de l'application correspondant à votre smartphone.

@pierreafranck
@bruhwiller_jerem
@ichbinkour
@heim_victor

## Screens de l'application

ADD SCREENS HERE

## Comment ça marche?

Vous pouvez retrouver tout le code source de notre application sur **METTRE LIEN GITHUB ICI**. 

> Quelques notions d'utilisation d'un terminal sont requises.

Afin de lancer l'application mobile, il vous suffira de vous rendre dans le dossier Mobile puis MobileClientArea. 

    cd mobile/MobileClientArea

*Exemple pour Ubuntu & MacOS.*

Une fois dans le bon dossier il faudra installer npm ainsi que expo.

_Ubuntu_

    sudo apt-get install npm
    npm install -g expo-cli

_MacOS_
 
    brew install npm
    npm install -g expo-cli
  
  Si des problèmes persistes, vous trouverez toutes les informations sur ces 2 sites internet :
  ***Expo :***
  https://bit.ly/2wL4EaR
  ***Npm :***
  https://bit.ly/2Ize9nd

Une fois celà fait, vous pouvez executer la commande suivante :

    npm install
Tous les packages nécessaires sont alors installés.

Vous pouvez désormais lancer le serveur qui hébergera votre application mobile :

    expo start

Nous vous conseillons de créer un compte sur le site d'expo afin de simplifier le lancement de l'application AREA sur votre mobile.
Suivez les instructions à l'écran afin de lancer l'application sur votre mobile.

## API

Nous utilisons notre propre API pour centraliser toutes les requêtes de l'application. Le code web et mobile est open source mais pour avoir accès à l'API, veuillez nous contacter, nous pouvons fournir le code source, néanmoins, ce sera à vous de l'héberger.

## Base de donnée

Nous utilisons notre propre base de donnée, celle-ci est privée. Nous stockons toutes les informations utilisateurs dans celle-ci.

## Connexion sécurisée

Toutes les connexions effectuées sur l'application mobile ou sur les divers services disponibles sont protégés en OAuth2. 

Plus d'informations sur le système d'authentification OAuth2 : https://bit.ly/2mWVuph

# Partie technique

## Développement de l'application

L'application mobile est entièrement développée sous react native, le langage créé par Facebook.
React native : https://bit.ly/1IzGz64

Nous utilisons cette technologie car elle nous évite de devoir développer 2 fois la même application, une fois en version iOS et une fois en version Android. C'était donc un bon compromis pour offrir une application fonctionnelle rapidement sur les 2 plateformes les plus utilisées du marché.

## Structure du projet

![Arbre des fichiers](https://i.ibb.co/1Xyg2sR/Capture-d-e-cran-2019-02-26-a-15-34-37.png)

### App.js

Le fichier App.js est la base de toute l'application mobile. C'est le fichier qui permet de lancer l'application.
Vous y trouverez notamment l'affichage total de l'application.
![App.js](https://i.ibb.co/k1tdG4r/Capture-d-e-cran-2019-02-26-a-15-38-30.png)
Sur cette image vous apercevez le *StackNavigator* qui permet de naviguer entre les différents onglets de l'application suivant les views que nous lui assignons. Si vous souhaitez rajouter un onglet en dehors du *MainTabNavigator*, il faudra l'ajouter au *StackNavigator*.

**Exemple :** si vous souhaitez rajouter une view entre la connexion et le coeur de l'application qui est le *MainTabNavigator*.

> Il est possible que la fonction StackNavigator soit deprecated suivant la version React Native que vous utilisez. Vous pouvez la remplacer par CreateStackNavigator.

### Screens

![Screens](https://i.ibb.co/1qq65tf/Capture-d-e-cran-2019-02-26-a-15-50-39.png)
Les fichiers contenus dans le dossier *screens* sont des fichiers de configuration des différentes *views* de l'application.
Si vous souhaitez **modifier** l'aspect d'un des onglets de l'application, ça se passera dans le fichier correspondant.

### Les requêtes

![Requests](https://i.ibb.co/n1tGDWq/Capture-d-e-cran-2019-02-26-a-15-53-32.png)
Nous effectuons toutes nos requêtes grâce à Fetch.
Plus d'informations sur Fetch React Native ici : https://bit.ly/2IDPJJy
Une fois la requête effectuée, nous traitons les informations que notre API renvoie afin d'afficher les données voulues.

Pour toutes nos requêtes (une fois l'utilisateur connecté) il faut obligatoirement un token de connexion, afin d'éviter que n'importe qui puisse se connecter à notre API et lui faire des requêtes.