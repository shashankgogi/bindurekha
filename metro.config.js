module.exports = {
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx"], //add here
  },
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
};
