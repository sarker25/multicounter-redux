// helper function
function getNextId(counter) {
  return counter.reduce((acc, curr) => Math.max(curr.id, acc), -1) + 1;
}
function getRandomValue(val = 10) {
  return Math.floor(Math.random() * val + 1);
}

// select dom element

const counters = document.getElementById("counters");
const addCounterButton = document.getElementById("addBtn");
const resetCounterButton = document.getElementById("reset");

// initial state
const init = [
  {
    id: 0,
    value: 0,
    incrementBy: getRandomValue(),
    decrementBy: getRandomValue(),
  },
];

// action identifier

const ADDCOUNTER = "addcounter";
const RESETCOUNTER = "resetcounter";
const INCREMENT = "increment";
const DECREMENT = "decrement";

// action creator

function addCounter() {
  return {
    type: ADDCOUNTER,
  };
}

function resetCounter() {
  return {
    type: RESETCOUNTER,
  };
}

// create reducer

function counterReducer(state = init, action) {
  if (action.type === ADDCOUNTER) {
    return [
      ...state,
      {
        id: getNextId(state),
        value: 0,
        incrementBy: getRandomValue(),
        decrementBy: getRandomValue(),
      },
    ];
  } else if (action.type === RESETCOUNTER) {
    return state.map((counter) => {
      return {
        ...counter,
        value: 0,
      };
    });
  } else if (action.type === INCREMENT) {
    const { counterId, value } = action.payload;
    const updatedState = state.map((element) => {
      if (element.id === counterId) {
        return {
          ...element,
          value: element.value + value,
        };
      } else {
        return { ...element };
      }
    });
    return [...updatedState];
  } else if (action.type === DECREMENT) {
    const { counterId, value } = action.payload;
    return state.map((counter) => {
      if (counter.id === counterId) {
        return {
          ...counter,
          value: counter.value - value,
        };
      }
      return { ...counter };
    });
  } else {
    return state;
  }
}

// create store
const store = Redux.createStore(counterReducer);

function render() {
  const state = store.getState();
  let allCounter = "";
  state.forEach((element) => {
    allCounter += `
              <div
          class="p-4 h-auto flex flex-col items-center justify-center space-y-5 bg-white rounded shadow"
        >
          <div class="text-2xl font-semibold" id="counter">${element.value}</div>
          <div class="flex space-x-3">
            <button
              class="bg-indigo-400 text-white px-3 py-2 rounded shadow"
              id="increment" onclick = "incrementHandler(${element.id}, ${element.incrementBy})"
            >
              Increment(${element.incrementBy})
            </button>
            <button
              class="bg-red-400 text-white px-3 py-2 rounded shadow"
              id="decrement" onclick = "decrementHandler(${element.id}, ${element.decrementBy})"
            >
              Decrement(${element.decrementBy})
            </button>
          </div>
        </div>
        `;
  });
  counters.innerHTML = allCounter;
}

// update ui initially
render();
store.subscribe(render);

addCounterButton.addEventListener("click", () => {
  store.dispatch(addCounter());
});
resetCounterButton.addEventListener("click", () => {
  store.dispatch(resetCounter());
});
function incrementHandler(counterId, value) {
  store.dispatch({
    type: INCREMENT,
    payload: {
      counterId,
      value,
    },
  });
}
function decrementHandler(counterId, value) {
  store.dispatch({
    type: DECREMENT,
    payload: {
      counterId,
      value,
    },
  });
}
