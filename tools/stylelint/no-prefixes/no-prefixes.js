const stylelint = require('stylelint');
const NeedsPrefix = require('./needs-prefix');
const parseSelector = require('stylelint/lib/utils/parseSelector');

const ruleName = 'material/no-prefixes';
const messages =  stylelint.utils.ruleMessages(ruleName, {
  property: property => `Unprefixed property "${property}".`,
  value: (property, value) => `Unprefixed value in "${property}: ${value}".`,
  atRule: name => `Unprefixed @rule "${name}".`,
  mediaFeature: value => `Unprefixed media feature "${value}".`,
  selector: selector => `Unprefixed selector "${selector}".`
});

/**
 * Stylelint plugin that warns for unprefixed CSS.
 */
const plugin = stylelint.createPlugin(ruleName, browsers => {
  return (root, result) => {
    if (!stylelint.utils.validateOptions(result, ruleName, {})) return;

    const needsPrefix = new NeedsPrefix(browsers);

    // Check all of the `property: value` pairs.
    root.walkDecls(node => {
      let message = null;

      if (needsPrefix.property(node.prop)) {
        message = messages.property(node.prop);
      } else if (needsPrefix.value(node.prop, node.value)) {
        message = messages.value(node.prop, node.value);
      }

      if (message) {
        stylelint.utils.report({
          result, ruleName, message, node,
          index: (node.raws.before || '').length
        });
      }
    });

    // Check all of the @-rules and their values.
    root.walkAtRules(node => {
      let message = null;

      if (needsPrefix.atRule(node.name)) {
        message = messages.atRule(node.name);
      } else if (needsPrefix.mediaFeature(node.params)) {
        message = messages.mediaFeature(node.name);
      }

      if (message) {
        stylelint.utils.report({ result, ruleName, message, node });
      }
    });

    // Walk the rules and check if the selector needs prefixes.
    root.walkRules(rule => {
      // Silence warnings for SASS selectors. Stylelint does this in their own rules as well:
      // https://github.com/stylelint/stylelint/blob/master/lib/utils/isStandardSyntaxSelector.js
      parseSelector(rule.selector, { warn: () => {} }, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          if (needsPrefix.selector(pseudoNode.value)) {
            stylelint.utils.report({
              result,
              ruleName,
              message: messages.selector(pseudoNode.value),
              node: rule,
              index: (rule.raws.before || '').length + pseudoNode.sourceIndex,
            });
          }
        });
      });
    });

  };
});


plugin.ruleName = ruleName;
plugin.messages = messages;
module.exports = plugin;
