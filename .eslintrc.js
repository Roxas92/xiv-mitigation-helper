module.exports = {
	root: true,

	env: {
		node: true,
	},

	extends: [
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
	],

	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		indent: 'off',
		'@typescript-eslint/indent': ['error', 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
		'vue/html-indent': ['error', 'tab'],
		'vue/multiline-html-element-content-newline': [
			'error',
			{
				ignoreWhenEmpty: true,
				ignores: ['pre', 'textarea'],
			},
		],
		'max-len': 0,
		'no-param-reassign': ['error', { props: false }],
		'no-underscore-dangle': 0,
		'vue/block-spacing': 'error',
		'vue/camelcase': ['error', { allow: ['alpha_spaces'] }],
		'vue/component-name-in-template-casing': 'error',
		'vue/match-component-file-name': 'error',
		'vue/require-component-is': 0,
		'no-plusplus': 0,
		'import/prefer-default-export': 0,
		'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
		'func-style': ['error', 'expression'],
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',
		"semi": "off",
		"@typescript-eslint/semi": ["error"]
	},

	parser: 'vue-eslint-parser',

	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		ecmaVersion: 2020, // allow the parsing of modern ecmascript
		ecmaFeatures: {
			jsx: false,
		},
	},

	plugins: ['vue', '@typescript-eslint'],

	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/__mocks__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
			env: {
				jest: true,
			},
		},
	],
};
