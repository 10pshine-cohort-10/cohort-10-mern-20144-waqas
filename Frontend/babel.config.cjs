/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  overrides: [
    {
      test: /\.(ts|tsx)$/,
      parserOpts: { plugins: ["typescript", "jsx"] },
      plugins: [
        {
          visitor: {
            Identifier(path) {
              if (path.node.optional) {
                path.node.optional = false;
              }
            },
            ClassProperty(path) {
              if (path.node.readonly) {
                path.node.readonly = false;
              }
            },
            TSTypeAnnotation(path) {
              path.remove();
            },
            TSTypeAliasDeclaration(path) {
              path.remove();
            },
            TSInterfaceDeclaration(path) {
              path.remove();
            },
            TSTypeParameterInstantiation(path) {
              path.remove();
            },
            TSTypeParameterDeclaration(path) {
              path.remove();
            },
            TSAsExpression(path) {
              path.replaceWith(path.node.expression);
            },
            TSTypeAssertion(path) {
              path.replaceWith(path.node.expression);
            },
            TSNonNullExpression(path) {
              path.replaceWith(path.node.expression);
            },
          },
        },
      ],
    },
  ],
};


