# TODO App Fight Round 1

A presentation about building a TODO app with [React], [RxJS], and
[partial.lenses], held at [Gofore] on 25th November 2019 in Jyväskylä,
Finland.

This was part of a demo series at Gofore demonstrating different ways to
build a TODO app in the browser, with non-trivial state management
requirements.

[Slides] (mostly in Finnish)<br>
[Online demo][todo-app-fight-round-1-online-demo] (of the full-blown app)

## The app

The presentation included building a TODO app in phases. The app is in
[`demo.jsx`][demo.jsx], in the [demo][demo-branch] branch. Commits in
the demo branch show how the app evolves:

1. Start with a vanilla React-app, with [`useReducer`][React useReducer]
   to trigger updating the state tree and [partial.lenses] to build the
   updated data structure.

2. Replace `useReducer` with [RxJS], moving state management inside
   [RxJS Observables][RxJS Observable].

3. Simulate tasks sent from the backend.

4. Add keyboard shortcuts to add commonly used tasks (contrived example,
   but demonstrates how you can add more event sources in RxJS).

The full-blown TODO app is in [`app.jsx`][app.jsx].

To run the apps for development:

``` shell
npm run app:serve
```

Open `https://localhost:8080` for `app.jsx` and
`https://localhost:8080/demo.html` for `demo.jsx`.

To build the apps:

``` shell
NODE_ENV=production npm run app:build
```

## This work is under public domain

<p xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license"
     href="http://creativecommons.org/publicdomain/zero/1.0/">
    <img src="https://licensebuttons.net/p/zero/1.0/80x15.png" style="border-style: none;" alt="CC0" />
  </a>
  <br />
  To the extent possible under law,
  <a rel="dct:publisher"
     href="https://github.com/tkareine/todo-app-fight-round-1">
    <span property="dct:title">Tuomas Kareinen</span></a>
  has waived all copyright and related or neighboring rights to
  <span property="dct:title">TODO App Fight Round 1</span>.
This work is published from:
<span property="vcard:Country" datatype="dct:ISO3166"
      content="FI" about="https://github.com/tkareine/todo-app-fight-round-1">
  Finland</span>.
</p>

[Gofore]: https://gofore.com/
[React useReducer]: https://reactjs.org/docs/hooks-reference.html#usereducer
[React]: https://reactjs.org/
[RxJS Observable]: https://rxjs-dev.firebaseapp.com/guide/observable
[RxJS]: https://rxjs-dev.firebaseapp.com/
[Slides]: https://tkareine.github.io/todo-app-fight-round-1/
[app.jsx]: https://github.com/tkareine/todo-app-fight-round-1/blob/master/src/app.jsx
[demo-branch]: https://github.com/tkareine/todo-app-fight-round-1/tree/demo/
[demo.jsx]: https://github.com/tkareine/todo-app-fight-round-1/blob/demo/src/demo.jsx
[partial.lenses]: https://github.com/calmm-js/partial.lenses
[todo-app-fight-round-1-online-demo]: https://codesandbox.io/s/wonderful-waterfall-rb89g
