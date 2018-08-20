// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w'
  },
  apiUrl:'http://192.168.92.33:5000/api/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
