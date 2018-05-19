import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
  }
}

class Walker extends Lint.RuleWalker {
  visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
    node.parameters.forEach(param => {
      if (this._isOptional(param) && !this._isNullableParameter(param)) {
        this.addFailureAtNode(param, 'Optional parameters must be either nullable or optional.');
      }
    });

    super.visitConstructorDeclaration(node);
  }

  private _isOptional(node: ts.ParameterDeclaration): boolean {
    return !!node.decorators && !!node.decorators.find(decorator => {
      return decorator.expression.getText().startsWith('Optional(');
    });
  }

  private _isNullableType({kind}: ts.TypeNode): boolean {
    return kind === ts.SyntaxKind.NullKeyword ||
           kind === ts.SyntaxKind.UndefinedKeyword ||
           kind === ts.SyntaxKind.VoidKeyword;
  }

  private _isNullableParameter(node: ts.ParameterDeclaration): boolean {
    if (!node.type || node.questionToken || node.type.kind === ts.SyntaxKind.AnyKeyword) {
      return true;
    }

    if (tsutils.isUnionTypeNode(node.type) || tsutils.isIntersectionTypeNode(node.type)) {
      return !!node.type.types.find(type => this._isNullableType(type));
    }

    return this._isNullableType(node.type);
  }
}
