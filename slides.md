# TODO App Fight

## Round 1

React, RxJS, partial.lenses

_25th Nov 2019_

---

# TODO-appistappelu

## Kierros 1

React, RxJS, partial.lenses

Eli kuinka hallita tilaa RxJS:llä ja käyttää Reactia vain tilan renderöintiin*

(* React-komponentti voi silti hyödyntää paikallista tilaa)

_25.11.2019_

---

## Millainen on TODO-appis?

_(demo)_

---

## Immutable-tilapuu, motivaatio

Esitämme sovelluksen tilan puumaisena rakenteena (tilapuu), jonka
juurena on objekti.

Haluamme tilapuun olevan immutable, jotta sen päivitys tapahtuu aina
eksplisiittisesti:

`fn(oldState) => newState`

Tämä helpottaa ohjelman logiikan seuraamista ja vähentää bugeja.

Välitämme React-komponenteille vain tarvittavat osat tilapuusta.

Mikään React-komponentti ei voi mutatoida saamaansa tilapuun osaa.

---

## Immutable-tilapuu, toteutus

Mahdollistamme tämän seuraavasti:

* Käytämme JavaScriptin natiivia Arrayta ja Objektia
  * Kaikille tuttu API
  * Helppo syntaksi (literaalit)

* `Object.freeze` ja `freezeDeep` estävät mutatoinnin

* Päivitämme puun osia [partial.lenses]-kirjastolla
  * Vaihtoehto: [Immer]

---

## partial.lenses

[partial.lenses] on lens-abstraktiota käyttävä kirjasto, jolla voi hakea
ja päivittää osia immutable-tietorakenteista, tuottaen niistä uusia
versioita.

Kirjasto erottelee datan osoituksen (lenses) datan muuttamisesta.

Arvon päivitys objektiin:

``` javascript
const m = {a: {b: 1}, c: 2}
L.set(["a", "b"], 3, m) // => {a: {b: 3}, c: 2}
```

Objektien yhdistäminen:

``` javascript
const m = {a: {b: 1}}
L.assign("a", {c: 2}, m) // => {a: {b: 1, c: 2}}
```

---

## Valittu tilapuu

``` javascript
{
  // the last event triggering a change to the state; for self-inspection
  lastEvent: {
    type: string,
    // plus event data, such as task id; depends on event type
  },
  // data model, to be consumed by React components
  model: {
    taskFilterText: string,
    tasks: [
      {id: uuid, isDone: boolean, name: string}
      // ...
    ]
  }
}
```

---

## React, komponenttihierarkia

```
App
|
+- SearchTaskField
|
+- TaskList
|  |
|  +- Task
|  +- Task
|  `- Task
|
`- AddTaskField
```

---

## React, tilanhallinta

Määritellään alkutila (`startState`, `useReducer`).

Tila välitetään propseina React-komponenteille.

Komponenteilla voi olla oma sisäinen tila, esimerkiksi tallentamaan
input-elementin teksti (`useState` `SearchTaskField`-komponentissa).

Tila ja komponentit päivittyvät Reactin hallinnoimista DOM-tapahtumista
(`click`, `keydown`; _React controlled component_).

_(demo)_

Kuinka päivittää komponentti DOM:n ulkopuolelta?

`App`-komponentti renderöityy, vaikka normalisoitu hakuteksti ei muutu.

---

## RxJS

| | Single | Multiple |
| --- | --- | --- |
| **Pull** | function | Iterator |
| **Push** | Promise | Observable |

**Observable**: producer of many values (events), pushes them to
**Observers** (subscribers).

Each Observer gets an independent execution of the Observable subscribed
to (unicast).

**Subject**: special Observable that allows shared execution to many
Observers (multicast). Like pub-sub.

---

## RxJS ja React

Tilaa hallitaan RxJS:llä, Reactilla renderöidään tila.

_(demo)_

---

# Miksi tämä kaikki?

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Q_7KaMDHoGs?start=176" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

_(Palpatinen ähkäisy lopussa johtuu mahdollisen konffauksen määrästä.)_

---

## Ratkaisun hyödyt

Sovellusten rakentaminen kirjastoilla, jotka sopivat hyvin yhteen, antaa
paljon joustavuutta suunnitteluun.

Vertaa sovelluskehyksen käyttöön, jossa päätökset on jo tehty
puolestasi. Sopiiko sovelluskehys ongelmaasi, tunnetko edes ongelmaa
hyvin projektin alussa?

Mahdollistaa kirjastojen vaihtamisen, jos kirjastojen paradigma on
suunnilleen samanlainen. Esimerkiksi:

* [RxJS]:n voi korvata [Bacon.js]:llä
* [partial.lenses]-kirjaston voi korvata [Immer]:llä tai tavallisella JS:llä

*Tilanhallinta on aina eksplisiittistä. Sinä olet ohjaksissa!*

---

## Ratkaisun hyödyt

React-komponenttien koodi on intuitiivista.

> "Great programmers write baby code"

&ndash; Eric Meijer, Principles of Reactive Programming -verkkokurssi

---

## Kokemuksia RxJS:stä

Deklaratiivinen API on aluksi hankala käyttää:

* Vaatii erilaisen tavan ajatella ratkaisuja
* Tutustumisen jälkeen API toimii odotetusti

Soveltuu erityisen hyvin async-tapahtumien hallintaan.

Mahdolliset bugit johtuvat väärästä tavasta mallintaa tapahtumia
(events).

RxJS on ollut olemassa useita vuosia. Vakaa ja suorituskykyinen.

---

## Ratkaisun haitat

Vaatii jonkin verran boilerplate-koodia, mikä voi aluksi turhauttaa.

Takaisinmaksu tulee toteuttaessa sovelluksia, joissa vaaditaan
monimutkaista tilanhallintaa.

Tilanhallinnan yhdistävä Observable (`stateO`) sijoittuu sovelluksen
ylimmälle tasolle.

Demon `controller`-abstraktio on hieman kömpelö, mutta mielestäni
välttämätön, jottei `actionS` (Subject) välity React-komponenteille
(liikaa valtaa).

---

## Lue ja tutki lisää

* Kuvaus RxJS:n [Observable][RxJS Observables]-abstraktiosta
* Immutable-tietorakenteiden päivitys: [partial.lenses] tai [Immer]
* Demon [online-versio][todo-app-fight-round-1-online-demo]

<div class="footnote">

(Esitys toteutettu [Hacker's Tiny Slide Deckillä][hackers-tiny-slide-deck].)

</div>

[Bacon.js]: https://baconjs.github.io/
[Immer]: https://github.com/immerjs/immer
[RxJS Observables]: https://rxjs-dev.firebaseapp.com/guide/observable
[RxJS]: https://rxjs-dev.firebaseapp.com/
[hackers-tiny-slide-deck]: https://github.com/tkareine/hackers-tiny-slide-deck
[partial.lenses]: https://github.com/calmm-js/partial.lenses
[todo-app-fight-round-1-online-demo]: https://codesandbox.io/s/wonderful-waterfall-rb89g

<style type="text/css" media="screen">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,400i,700|Roboto+Mono:400,700);
:root {
  --htsd-sans-font-family: 'Roboto', sans-serif;
  --htsd-mono-font-family: 'Roboto Mono', monospace;
}
.htsd-slide .footnote {
  margin-top: 10rem;
  font-size: 70%;
  opacity: 0.7;
}
</style>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/hackers-tiny-slide-deck@0.1.0/build/htsd.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/prism.min.js"></script>
