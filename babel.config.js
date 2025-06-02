// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        [
          'babel-preset-expo',
          {
            // ✨ polyfill for Hermes
            unstable_transformImportMeta: true,
          },
        ],
      ],
      plugins: [
        // keep any other plugins you already use
        'react-native-reanimated/plugin',   // ← if you have Reanimated
      ],
    };
};