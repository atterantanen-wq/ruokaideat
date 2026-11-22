/* Reseptikirjasto. Reseptit on kirjoitettu itse suosittujen suomalaisten reseptien pohjalta
 * (Martat, Valio, Yhteishyvä, Kotikokki); pohjana käytetyt reseptit ovat kunkin reseptin src-kentässä. */
import lisukkeet from "./lisukkeet.js";
import arki from "./arki.js";
import keitot from "./keitot.js";
import kasvis from "./kasvis.js";
import aamu from "./aamu.js";
import leivonta from "./leivonta.js";

export const LIB = [...arki, ...keitot, ...kasvis, ...aamu, ...leivonta, ...lisukkeet];
