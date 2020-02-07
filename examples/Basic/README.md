## FAQ
##### Why is react-native-multi-slider not listed as a dependency in package.json in the example?

react-native uses metro for dependency resolution. In order to not recursively install this example into the node_modules of this example we use metro.config.js to resolve react-native-multi-slider. 

This also allows a quicker iteration when developing (without having to yarn install after every single change in react-native-multi-slider).