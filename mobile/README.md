# Mini Support+ mobile

Client Flutter utilisant la même API REST et les mêmes jetons JWT que `../frontend`.

## Fonctions

- Inscription et connexion utilisateur.
- Conservation locale de la session.
- Création et liste des tickets pour un utilisateur.
- Vue agent triée côté backend, attribution d'un ticket et changement de statut.

## Prérequis et initialisation de la plateforme

Flutter n'est pas installé dans l'environnement de travail actuel. Après l'avoir installé, depuis ce dossier, exécutez une fois :

```powershell
flutter create --platforms=android,ios .
flutter pub get
```

Cette commande génère les fichiers Android/iOS standards sans toucher au code de `lib/` ni à `pubspec.yaml`.

## Connexion au backend local

L'API doit tourner sur le port 4000 (`cd ../backend; npm run dev`).

Sur l'émulateur Android, la valeur par défaut fonctionne : `http://10.0.2.2:4000/api`.

Pour un téléphone physique, lancez l'application avec l'IP locale de votre ordinateur :

```powershell
flutter run --dart-define=API_URL=http://192.168.1.50:4000/api
```

Remplacez l'adresse IP par celle de votre ordinateur. Le téléphone et le PC doivent être sur le même réseau.

Pour un iPhone Simulator, utilisez généralement :

```powershell
flutter run --dart-define=API_URL=http://localhost:4000/api
```

## HTTP local Android

Pour utiliser l'API HTTP locale en développement, après `flutter create`, ajoutez dans le nœud `<application>` de `android/app/src/main/AndroidManifest.xml` :

```xml
android:usesCleartextTraffic="true"
```

Cette option est uniquement pour le développement. Une API de production doit employer HTTPS.

## Lancement

```powershell
flutter run
```

Le compte agent de démonstration créé avec `npm run seed:agent` peut également se connecter depuis cette application.
