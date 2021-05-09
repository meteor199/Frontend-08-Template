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
      this.templatePath("src/HelloWorld.vue"),
      this.destinationPath("src/HelloWorld.vue"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("src/types/modules.d.ts"),
      this.destinationPath("src/types/modules.d.ts"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("src/main.ts"),
      this.destinationPath("src/main.ts"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("src/index.html"),
      this.destinationPath("src/index.html"),
      { title: answers.name }
    );

    this.fs.copyTpl(
      this.templatePath("test/babel-register.js"),
      this.destinationPath("test/babel-register.js")
    );
    this.fs.copyTpl(
      this.templatePath("test/test-sample.spec.ts"),
      this.destinationPath("test/test-sample.spec.ts")
    );

    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath(".mocharc.json"),
      this.destinationPath(".mocharc.json"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json"),
      {}
    );
  }
};
