PS E:\projek kecil-kecilan\mobile\TitikKoma> npx expo start        
env: load .env
env: export EXPO_PUBLIC_GEMINI_API_KEY
Starting project at E:\projek kecil-kecilan\mobile\TitikKoma
› Port 8081 is being used by another process
√ Use port 8082 instead? ... yes
Using src/app as the root directory for Expo Router.
Starting Metro Bundler
The following packages should be updated for best compatibility with the installed expo version:
  @types/react@19.2.18 - expected version: ~19.1.10
  typescript@6.0.3 - expected version: ~5.9.2
Your project may not work correctly until you install the expected versions of the packages.
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █   █▄▀▀▄██ ▄▄▄▄▄ █
█ █   █ █ ▀▄ █▀▄▀▄█ █   █ █
█ █▄▄▄█ █▀██▀▀█▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄▀▄█ █▄█▄█▄▄▄▄▄▄▄█
█  ██▄ ▄▀█▀▀▄▀█▄ ███ ▀▄▄ ▄█
█▄▀▀▀▀▄▄ ▄█▀ ▄██ ▀▀ █▄  ▀██
█▀▀▄▄ ▀▄ █▀▄█▄▀▄▀▄▀▄▀▀▄ ▀██
████▀▀ ▄▀▄▀▄█▀██▄▄▄█▄▀ ▀███
█▄▄▄███▄█▀ ▀▄▀█▄▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀ ▄ ▄██▀ █▄█ ▀▀█▀█
█ █   █ █▄▄▄█▄▀▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀ ▄█▀▄█▄██▄▀█▀▀ ██
█▄▄▄▄▄▄▄█▄▄█▄▄▄▄████▄▄▄▄▄▄█

› Metro waiting on exp://192.168.1.29:8082
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Web is waiting on http://localhost:8082

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
Android Bundled 43536ms node_modules\expo-router\entry.js (1682 modules)
 WARN  `expo-notifications` functionality is not fully supported in Expo Go:
We recommend you instead use a development build to avoid limitations. Learn more: https://expo.fyi/dev-client.
 WARN  Due to changes in Androids permission requirements, Expo Go can no longer provide full access to the media library. To test the full functionality of this module, you can create a development build. https://docs.expo.dev/develop/development-builds/create-a-build
 ERROR  expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go. Read more at https://docs.expo.dev/develop/development-builds/introduction/.

Call Stack
  construct (<native>)
  apply (<native>)
  _construct (node_modules\@babel\runtime\helpers\construct.js)
  Wrapper (node_modules\@babel\runtime\helpers\wrapNativeSuper.js)
  construct (<native>)
  _callSuper (node_modules\@babel\runtime\helpers\callSuper.js)
  NamelessError (node_modules\@expo\metro-runtime\src\metroServerLogs.native.ts)
  captureCurrentStack (node_modules\@expo\metro-runtime\src\metroServerLogs.native.ts)
  HMRClient.log (node_modules\@expo\metro-runtime\src\metroServerLogs.native.ts)
  console.level (node_modules\react-native\Libraries\Core\setUpDeveloperTools.js)
  warnOfExpoGoPushUsage (node_modules\expo-notifications\build\warnOfExpoGoPushUsage.js)
  addPushTokenListener (node_modules\expo-notifications\build\TokenEmitter.js)
  <global> (node_modules\expo-notifications\build\DevicePushTokenAutoRegistration.fx.js)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  <global> (node_modules\expo-notifications\build\getExpoPushTokenAsync.js)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  <global> (node_modules\expo-notifications\build\index.js)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  <global> (src\hooks\useDailyNotif.ts)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  <global> (src\app\more.tsx)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  Object.defineProperties$argument_1.moreTsx.get (src\app)
  metroContext (src\app)
  node.loadRoute (node_modules\expo-router\build\getRoutesCore.js)
  getDirectoryTree (node_modules\expo-router\build\getRoutesCore.js)
  getDirectoryTree (node_modules\expo-router\build\getRoutesCore.js)
  getRoutes (node_modules\expo-router\build\getRoutesCore.js)
  getRoutes (node_modules\expo-router\build\getRoutes.js)
  useStore (node_modules\expo-router\build\global-state\router-store.js)
  ContextNavigator (node_modules\expo-router\build\ExpoRoot.js)
  callComponent.reactStackBottomFrame (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  renderWithHooks (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  updateFunctionComponent (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  beginWork (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  runWithFiberInDEV (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performUnitOfWork (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  workLoopSync (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  renderRootSync (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performWorkOnRoot (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performWorkOnRootViaSchedulerTask (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)

Call Stack
  ExpoRoot (node_modules\expo-router\build\ExpoRoot.js)
  App (node_modules\expo-router\build\qualified-entry.js)
  WithDevTools (node_modules\expo\src\launch\withDevTools.tsx)
