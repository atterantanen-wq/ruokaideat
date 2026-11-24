/* Sovelluksen sisäänkäynti. Moduulit (src/app) suoritetaan samassa järjestyksessä kuin ne olivat
   alkuperäisessä main.js:ssä: jokainen moduuli tuo ensimmäisenä edeltäjänsä, ja tämä tiedosto tuo
   ketjun viimeisen. Järjestys: core, prices, catalog, state, ideas, search, price-updates, cart,
   cart-add, cart-view, info, tabs, registry, editor, clicks, backup, cook, start, plan-view, pantry-view. */
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/theme.css";
import "./styles/main.css";
import "./app/pantry-view.js";
import {ingFor,plCostPer,plCands,plDefaults,autoN} from "./app/plan-view.js";
import {R,parseIng} from "./app/core.js";
import {catFind,recipeNut,nutPer,findPrice,nameSkip,isSkip,selR,recipeCost} from "./app/catalog.js";
import {state} from "./app/state.js";
import {byId} from "./app/ideas.js";
import * as PL from "./planner.js";
import {LIB} from "./data/library/index.js";
import {applySel} from "./recipes.js";

/* kehitystila: testiskriptien apu (ei mukana tuotantoversiossa) */
if(import.meta.env.DEV)window.__app={PL,plCands,autoN,plDefaults,ingFor,plCostPer,R,LIB,parseIng,catFind,findPrice,nameSkip,isSkip,selR,applySel,recipeCost,recipeNut,nutPer,byId,get state(){return state;}};
