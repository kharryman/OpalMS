# CVAT Mobile

## Installation Instructions

### Dependencies
```
Node.JS v6.x.x LTS
NPM v4
Bower 1.X.X
Ionic CLI v3.X.X
ADB v1.X.X
```

### Installation

1. Run `npm install -g ionic` to install the Ionic CLI
2. CD into the `cvat-mobile-ionic` directory and run `bower install` to install the client-side dependencies.
3. Run `ionic serve` to run the local development server


### How to build
1. In the root project directory, run `ionic cordova build <platform_name>` where platform name is either `android` or `ios`
2. Run `adb install -r platforms/android/build/outputs/apk/android-debug.apk` to install the APK on the Android phone.



### Project Structure
```
| `resources` - directory for static files e.g. images, icons, splash images
| `www` - the primary directory in which development will occur
\
 | `templates` - the diretory conaining HTML markup
 | `js`
  \
   |`app.js` - the main Module. Contains the `Routes` and `Dependencies`
   | `controllers.js` - contains the logic for each `Template` within the project
   | `services.js` - contains modules for specific application logic. E.g. calling the backend with CVATApi, or constructor functions for specific business objects e.g. `Vehicle` / `Employee`.


```


### How to Contribute
