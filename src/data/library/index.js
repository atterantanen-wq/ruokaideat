/* Reseptikirjasto. Reseptit on kirjoitettu itse suosittujen suomalaisten reseptien pohjalta
 * (Martat, Valio, Yhteishyvä, Kotikokki, K-Ruoka, Arla); pohjana käytetyt reseptit ovat kunkin reseptin src-kentässä. */
import lisukkeet from "./lisukkeet.js";
import arki from "./arki.js";
import keitot from "./keitot.js";
import juhla from "./juhla.js";
import kasvis from "./kasvis.js";
import aamu from "./aamu.js";
import leivonta from "./leivonta.js";
import valipalat from "./valipalat.js";
import perus from "./perus.js";
import airfryer from "./airfryer.js";
import grilli from "./grilli.js";

export const LIB = [...arki, ...keitot, ...juhla, ...airfryer, ...grilli, ...kasvis, ...aamu, ...valipalat, ...perus, ...leivonta, ...lisukkeet];
