import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

/**
 * Rule that catches cases where a property of a `SimpleChanges` object is accessed directly,
 * rather than through a literal. Accessing properties of `SimpleChanges` directly can break
 * when using Closure's property renaming.
 */
export class Rule extends Lint.Rules.TypedRule {
  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
  }
}

class Walker extends Lint.ProgramAwareRuleWalker {
  visitClassDeclaration(classDeclaration: ts.ClassDeclaration) {
    classDeclaration.members.forEach(member => {
      // Walk through all of the `ngOnChanges` methods that have at least one parameter.
      if (ts.isMethodDeclaration(member)) {
        if (member.name.getText() === 'ngOnChanges' && member.parameters.length && member.body) {
          this._walkNgOnChanges(member, classDeclaration);
        }
      }
    });

    super.visitClassDeclaration(classDeclaration);
  }

  private _walkNgOnChanges(method: ts.MethodDeclaration, classDeclaration: ts.ClassDeclaration) {
    const walkChildren = (node: ts.Node) => {
      // Walk through all the nodes and look for property access expressions
      // (e.g. `changes.something`). Note that this is different from element access
      // expressions which look like `changes['something']`.
      if (tsutils.isPropertyAccessExpression(node)) {
        // Add a failure if we're trying to access a property on a SimpleChanges object
        // directly, because it can cause issues with Closure's property renaming.
        if (this._isAccessingSimpleChanges(node.expression)) {
          const expressionName = node.expression.getText();
          const propName = node.name.getText();

          this.addFailureAtNode(node, 'Accessing properties of SimpleChanges objects directly ' +
                                      'is not allowed. Use index access instead (e.g. ' +
                                      `${expressionName}.${propName} should be ` +
                                      `${expressionName}['${propName}']).`);
        }
      } else if (tsutils.isElementAccessExpression(node) &&
                  this._isAccessingSimpleChanges(node.expression)) {

        const arg = node.argumentExpression;

        if (tsutils.isStringLiteral(arg) || tsutils.isNoSubstitutionTemplateLiteral(arg)) {
          const propName = arg.getText().slice(1, -1);

          if (propName === 'disabled') {
            console.log(propName, this._hasProperty(propName, classDeclaration));
          }
        }
      }

      // Don't walk the property accesses inside of call expressions. This prevents us
      // from flagging cases like `changes.hasOwnProperty('something')` incorrectly.
      if (!tsutils.isCallExpression(node)) {
        node.forEachChild(walkChildren);
      }
    };

    method.body!.forEachChild(walkChildren);
  }

  private _hasProperty(propName: string, classDeclaration: ts.ClassDeclaration): boolean {
    const typeChecker = this.getTypeChecker();

    return (function checkDeclaration(node: ts.Node & {
      heritageClauses?: ts.NodeArray<ts.HeritageClause>
    }) {
      const type = typeChecker.getTypeAtLocation(node);

      console.log(type.symbol && type.symbol.name, typeChecker.getPropertiesOfType(type).length, typeChecker.getAugmentedPropertiesOfType(type).length);

      // console.log(node.kind, node.getText().slice(0, 50));

      if (type.getProperty(propName)) {
        return true;
      } else if (!node.heritageClauses) {
        return false;
      }

      for (const clause of node.heritageClauses) {
        for (const clauseType of clause.types) {
          const resolvedSymbol = typeChecker.getSymbolAtLocation(clauseType.expression);

          if (resolvedSymbol) {
            for (const declaration of resolvedSymbol.declarations) {
              // console.log(declaration.kind, declaration.getText().slice(0, 50));

              if (checkDeclaration(declaration)) {
                return true;
              }
            }
          }
        }
      }

      return false;
    })(classDeclaration);
  }

  private _isAccessingSimpleChanges(node: ts.Expression): boolean {
    const symbol = this.getTypeChecker().getTypeAtLocation(node).symbol;
    return symbol && symbol.name === 'SimpleChanges';
  }
}
