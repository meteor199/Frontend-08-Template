var Generator = require("yeoman-generator");
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
      },
    ]);
    const pkgJson = {
      name: answers.name,
      version: "1.0.0",
      main: "generators/app/index.js",
      license: "MIT",
      scripts: {
        test: "mocha",
        coverage: "nyc mocha",
        webpack: "webpack",
      },
      devDependencies: {},
      dependencies: {},
    };

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    this.npmInstall(["vue"], { "save-dev": false });
    this.npmInstall(
      [
        "webpack",
        "webpack-cli",
        "vue-loader",
        "vue-style-loader",
        "css-loader",
        "copy-webpack-plugin",
        "vue-template-compiler",

        "@babel/core",
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@babel/register",
        "@types/mocha",
        "@istanbuljs/nyc-config-babel",
        "babel-plugin-istanbul",
        "mocha",
        "typescript",
        "nyc",
      ],
      { "save-dev": true }
    );

    this.fs.copyTpl(
      this.templatePath("HelloWorld.vue"),
      this.destinationPath("src/HelloWorld.vue"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: answers.name }
    );
  }
};
