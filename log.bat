@ECHO OFF
cmd.exe /K "adb logcat -& adb logcat | FindStr /C:console"
