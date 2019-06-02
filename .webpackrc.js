const path = require('path');

export default {
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }] //按需加载
  ],
  alias: {
    Assets: path.resolve(__dirname, './src/assets'),
    images: path.resolve(__dirname, './src/assets/images') //设置路径
  },
  theme: "./src/theme.js" //自定义主题 
};
