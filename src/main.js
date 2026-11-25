/* Sovelluksen sisäänkäynti. Moduulit (src/app) suoritetaan samassa järjestyksessä kuin ne olivat
   alkuperäisessä main.js:ssä: jokainen moduuli tuo ensimmäisenä edeltäjänsä, ja tämä tiedosto tuo
   ketjun viimeisen. Järjestys: core, prices, catalog, state, ideas, search, price-updates, cart,
   cart-add, cart-view, info, tabs, registry, editor, clicks, backup, cook, start, plan-view, pantry-view. */
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/theme.css";
import "./styles/main.css";
import "./app/pantry-view.js";
import "./app/update.js";
import {ingFor,plCostPer,plCands,plDefaults,autoN,setPlPics} from "./app/plan-view.js";
import {R,parseIng} from "./app/core.js";
import {baseOf,variantsOf,catFind,recipeNut,nutPer,findPrice,nameSkip,isSkip,selR,recipeCost} from "./app/catalog.js";
import {state,cleanState} from "./app/state.js";
import {openReg} from "./app/registry.js";
import {byId} from "./app/ideas.js";
import * as PL from "./planner.js";
import {LIB} from "./data/library/index.js";
import {applySel} from "./recipes.js";
import {deptOf,packOf,otOf,otP,listItems,itemCost,XSUG} from "./app/cart.js";

/* kehitystila: testiskriptien apu (ei mukana tuotantoversiossa) */
if(import.meta.env.DEV)window.__app={PL,plCands,setPlPics,autoN,plDefaults,ingFor,plCostPer,R,LIB,parseIng,catFind,findPrice,nameSkip,isSkip,selR,applySel,recipeCost,recipeNut,nutPer,byId,deptOf,packOf,otOf,otP,listItems,itemCost,XSUG,baseOf,variantsOf,cleanState,openReg,get state(){return state;}};
