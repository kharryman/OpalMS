#!/bin/sh
ionic cordova build android &&
adb install -r platforms/android/build/outputs/apk/android-debug.apk

