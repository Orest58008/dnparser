enum Token {
	// Blank symbol that gets filtered out after
	Blank,
	// Integers and values
	Integer, FudgeFate,
	// Mathematical operations
	OpenBracket, CloseBracket,
	Plus, Minus, Mult, Div,
	// Dice symbols
	Delimiter, KeepHigh, KeepLow, Explode,
};

const tokenStrings = new Map([
	['F', Token.FudgeFate], ['f', Token.FudgeFate],
	['(', Token.OpenBracket], [')', Token.CloseBracket],
	['+', Token.Plus], ['-', Token.Minus],
	['*', Token.Mult], ['x', Token.Mult], ['/', Token.Div],
	['D', Token.Delimiter], ['d', Token.Delimiter],
	['H', Token.KeepHigh], ['L', Token.KeepLow],
	['!', Token.Explode], ['X', Token.Explode],
]);

function tokenise(input: string) : [Token[], (string | undefined)[]] {
	const tokens: Token[] = [];
	const values: (string | undefined)[] = [];
	
	input.split('').forEach((char: string, i: number, a: string[]) => {
		switch (true) {
			case /\s/.test(char):
				tokens.push(Token.Blank);
				values.push(undefined);
				
				return;
			case /[0-9]/.test(char):
				if (tokens[tokens.length - 1] !== Token.Integer) {
					tokens.push(Token.Integer);
					values[tokens.length - 1] = char;
				} else if (a[i - 1] === '%') {
					throw `Invalid ${char} placement`
				} else {
					const int = values[values.length - 1] ?? 0;
					values[values.length - 1] = ""+((+int)*10+(+char));
				}

				return;
			case char === '%':
				if (tokens[tokens.length - 1] !== Token.Integer) {
					tokens.push(Token.Integer);
					values[tokens.length - 1] = "100"
				} else {
					const int = values[values.length - 1] ?? 0;
					values[values.length - 1] = ""+(+int * 100);
				}

				return;
			case tokenStrings.has(char):
				// @ts-ignore : already checked
				tokens.push(tokenStrings.get(char));
				values.push(undefined);

				return;
			case true:
				throw `${char} is not a valid token`
		}});
	
	return [tokens, values];
};

export { tokenise };
