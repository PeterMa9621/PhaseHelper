const vscode = require('vscode');

const completionItems = {
    "Phase": {
        trigger: ':',
        methods: [{
            "text": "view",
            "type": "Method",
            "description": "Example: Return Phase::view();"
        }]
    },
	"Route": {
        trigger: ':',
        methods: [{
            "text": "phase",
            "type": "Method",
            "description": "Example: Route::phase('user/{id}', 'UserController@UserProfile');"
	    }]
    },
	"Vuex": {
        trigger: ':',
        methods: [{
            "text": "state",
            "type": "Method",
            "description": "Example: Vuex::state([ 'count' => 1 ]);"
        }, {
            "text": "module",
            "type": "Method",
            "description": "Example: Vuex::module('app/options', [ 'version' => '0.0.4' ]);"
        }, {
            "text": "commit",
            "type": "Method",
            "description": ["Example: Vuex::commit('user/SET_USER', Auth::user());"]
        }, {
            "text": "dispatch",
            "type": "Method",
            "description": ["Example: Vuex::dispatch('user/setActive', Auth::user());"]
        }, {
            "text": "register",
            "type": "Method",
            "description": ["Example: Vuex::register([ MyVuexModuleLoader::class ]);"]
        }, {
            "text": "load",
            "type": "Method",
            "description": ["Example: Vuex::load('users', 'all');"]
        }, {
            "text": "lazyLoad",
            "type": "Method",
            "description": ["Example: Vuex::lazyLoad('auth', 'user');"]
        }, {
            "text": "dd",
            "type": "Method",
            "description": ["Dump all the currently saved vuex state"]
        }]
    },
	"response()": {
        trigger: '->',
        methods: [{
            "text": "vuex",
            "type": "Method",
            "description": ["If the method is strictly for API calls, then returning only the updated vuex state with return response()->vuex(); will suffice"]
        }]
    }
};

const generateProviders = (prefix, completionItem) => {
    const trigger = completionItem.trigger;
    const methods = completionItem.methods;

    const firstLetter = prefix[0];

    const prefixProvider = vscode.languages.registerCompletionItemProvider(
		'php',
		{
			provideCompletionItems(document, position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.trim().startsWith(firstLetter)) {
					return undefined;
				}
                
				return [
					new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Class)
				];
			}
		},
		firstLetter
	);

    const methodProvider = vscode.languages.registerCompletionItemProvider(
		'php',
		{
			provideCompletionItems(document, position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				const prefixTrigger = prefix + (trigger===':'?'::':trigger);
                if (!linePrefix.endsWith(prefixTrigger)) {
					return undefined;
				}

                const items = [];
                for (let method of methods) {
                    items.push(new vscode.CompletionItem(method.text, vscode.CompletionItemKind[method.type]));
                }

				return items;
			}
		},
		trigger // triggered whenever a '.' is being typed
	);

    return [prefixProvider, methodProvider];
};

const generateAllProviders = () => {
    let allProviders = [];
    for (let prefix in completionItems) {
        let providers = generateProviders(prefix, completionItems[prefix]);
        allProviders = allProviders.concat(providers);
    }
    return allProviders;
}

module.exports = {
    completionItems,
    generateProviders,
    generateAllProviders
};