# Netflix Clone movies trailer Android

## Developed functionality 

Watch the lastest trailers quickly and easily like a famous streaming app.
Search for a movie , show movie details like casting or production focus on user experience

MoviesTrailer app allows you to see trailers of all popular movies, primarily in your native language. Search for an actor or director..., get the filmography  and the resume of an actor.Search any movie, find information about it and see the list of trailers for the same movie very easily.
Make your own movie favorite list quickly 

• Make you own movies list

• Show actor or director filmography

• Casting of the movie

• Get similar movies

• Manage all main languages

• Get the reviews of a movie 

• Get the list of provider for movies available in your country

• Results according to your preferred language

• View all upcoming movie trailers.

• Get a list of currently popular movies.

• Get a list of top rated movies.

• Search any movie with its information: title, rating, release date, language, genres, synopsis, production...

[Web mobile demo](https://android_netflix.surge.sh/)



This repository is an update of [Netflix_clone](https://github.com/ismailazdad/Netflix_clone) developing with React.js with some UI modifications for a better mobile experience.
I use  [Capacitor](https://github.com/ionic-team/capacitor) to convert React.js project to native Android project.
     
[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" width=30% height=30%>](https://play.google.com/store/apps/details?id=com.moviestrailer.app)     

if someone can do the same for ios and push the app to the apple store, it will be awesome :boom: :neckbeard: :monkey_face:

### Tutorial 
How to convert project to native app with capacitor : 

[tutorial](https://capacitorjs.com/docs/getting-started)

[tutorial android](https://capacitorjs.com/docs/android)

you can handle native event in your project using capacitor bridge to handle or modify wanted behavior

[handle native listenner](https://capacitorjs.com/docs/apis/app)

[icon app](https://capacitorjs.com/docs/guides/splash-screens-and-icons)

### Install capacitor

Run this command on the root of the project 

```npm i @capacitor/core```

```npm i -D @capacitor/cli```

```npx cap init```

```npm i @capacitor/android```

```npx cap add android```

```npx cap sync```

```npx cap run android```

### Icon for Android

Create a folder ```resources``` in the root of your project with ```icon.png``` and ```splash.png```

```npm install -g cordova-res```

```cordova-res android --skip-config --copy```

Synchronize your project to update android project folder

```npm run build```

```npx cap sync```

Go to Android Studio to fix all images declination for devices



 
### Preview

<img src="./src/assets/demo.png" width=30% height=30%>
<img src="./src/assets/demo2.png" width=30% height=30%>
<img src="./src/assets/demo3.png" width=30% height=30%>

