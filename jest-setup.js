// react-native-worklets & reanimated butuh runtime native (JSI) yang tidak ada di Jest.
// Animasi splash cuma dekorasi, jadi cukup dijalankan langsung tanpa worklet.
jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn, ...args) => fn?.(...args),
  scheduleOnUI: (fn, ...args) => fn?.(...args),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
}));

// Ikon/splash beranimasi butuh reanimated + JSI. Murni dekorasi, tidak dipakai
// oleh alur yang diuji, jadi diganti komponen kosong.
jest.mock('@/components/animated-icon', () => ({
  AnimatedSplashOverlay: () => null,
}));
