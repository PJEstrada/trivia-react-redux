// Utility Function
export const arrayMove = (arr, previousIndex, newIndex) => {
  const array = [...arr];
  if (newIndex && newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k + 1) {
      k -= 1;
      array.push(-1); // Fill spaces with -1 if need to rotate with external index
    }
  }

  if (previousIndex && newIndex) {
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  }

  return array;
};

export const byId = configuration => (state = {}, action) => {
  const {
    added,
    updated,
    updatedInBulk,
    fetched,
    removed,
    confirmed,
    addedToArrayAttribute,
    removedFromArrayAttribute,
    replacedInArrayAttribute,
    defaultAttributes,
    cascade,
    cleared,
    idKey = "id",
    customBehavior = (s, _a) => s // Identity reducer
  } = configuration;

  const { payload } = action;

  if (payload != null) {
    if (
      added != null &&
      added.includes(action.type) &&
      typeof payload === "object" &&
      (typeof payload[idKey] === "number" || typeof payload[idKey] === "string")
    ) {
      return {
        ...state,
        [payload[idKey]]: {
          ...(defaultAttributes || {}),
          ...payload
        }
      };
    }

    if (updated != null && updated.includes(action.type)) {
      if (
        typeof payload === "object" &&
        (typeof payload[idKey] === "number" ||
          typeof payload[idKey] === "string")
      ) {
        return {
          ...state,
          [payload[idKey]]: {
            ...state[payload[idKey]],
            ...payload
          }
        };
      }
    }

    if (updatedInBulk != null && updatedInBulk.includes(action.type)) {
      if (
        typeof payload === "object" &&
        typeof payload.order !== "undefined" &&
        payload.order.constructor === Array
      ) {
        const { order, ...attributes } = payload;
        const newState = {
          ...state
        };

        order.forEach(id => {
          newState[id] = {
            ...state[id],
            ...attributes
          };
        });

        return newState;
      }
    }

    if (fetched != null && fetched.includes(action.type)) {
      if (typeof payload === "object" && typeof payload.entities === "object") {
        const newEntities = {};
        Object.keys(payload.entities).forEach(id => {
          newEntities[id] = {
            ...(defaultAttributes || {}),
            ...(payload.entities || {})[id], // TODO: handle server string ids
            isConfirmed: true
          };
        });

        return {
          ...state,
          ...newEntities
        };
      }
    }

    if (removed != null && removed.includes(action.type)) {
      // TODO: handle payload object with id attribute
      if (typeof payload === "number" || typeof payload === "string") {
        const newState = {
          ...state
        };

        delete newState[payload];
        return newState;
      }
    }

    if (confirmed != null && confirmed.includes(action.type)) {
      if (typeof payload === "object") {
        const { oldId, newId, ...extra } = payload;

        if (
          typeof oldId !== "undefined" &&
          typeof newId !== "undefined" &&
          typeof state[oldId] !== "undefined"
        ) {
          const newState = {
            ...state
          };

          newState[newId] = {
            ...newState[oldId],
            ...extra,
            id: newId,
            isConfirmed: true
          };

          delete newState[oldId];
          return newState;
        }
        const newState = {};
        Object.keys(state).forEach(key => {
          newState[key] = {
            ...state[key],
            isConfirmed: true
          };
        });

        return newState;
      }
    }

    if (
      addedToArrayAttribute != null &&
      addedToArrayAttribute.includes(action.type)
    ) {
      if (typeof payload === "object") {
        const id = payload[idKey];
        const { key, order = [] } = payload;
        if (typeof id !== "undefined" && typeof state[id] !== "undefined") {
          const oldOrder = state[id][key] || [];
          return {
            ...state,
            [id]: {
              ...state[id],
              [key]: [...oldOrder, ...order.filter(i => !oldOrder.includes(i))]
            }
          };
        }
      }

      return state;
    }

    if (
      removedFromArrayAttribute != null &&
      removedFromArrayAttribute.includes(action.type)
    ) {
      if (typeof payload === "object") {
        const id = payload[idKey];
        const { key, order = [] } = payload;
        if (typeof id !== "undefined" && typeof state[id] !== "undefined") {
          const oldOrder = state[id][key] || [];
          return {
            ...state,
            [id]: {
              ...state[id],
              [key]: oldOrder.filter(i => !order.includes(i))
            }
          };
        }
      }

      return state;
    }

    if (
      replacedInArrayAttribute != null &&
      replacedInArrayAttribute.includes(action.type)
    ) {
      if (typeof payload === "object") {
        const id = payload[idKey];
        const { oldValues = [], newValues = [], key } = payload;
        if (typeof id !== "undefined" && typeof state[id] !== "undefined") {
          const oldOrder = state[id][key] || [];
          return {
            ...state,
            [id]: {
              ...state[id],
              [key]: oldOrder.map(oldValue =>
                oldValues.includes(oldValue)
                  ? newValues[oldValues.indexOf(oldValue)]
                  : oldValue
              )
            }
          };
        }
      }

      return state;
    }

    // REMEMBER THAT THIS CASCADE GIMMICK ONLY WORKS ONE LEVEL DEEP
    // If you want more depth, tie delete actions with sagas, but for most cases
    // this will do the trick.
    if (cascade != null) {
      const fk = cascade[action.type];
      if (typeof fk !== "undefined") {
        if (typeof payload === "number" || typeof payload === "string") {
          const removedId = payload;

          const newState = {};
          Object.keys(state)
            .map(elementKey => state[parseInt(elementKey, 10)])
            .forEach(element => {
              if (
                typeof element[fk] !== "undefined" &&
                element[fk] !== removedId
              ) {
                newState[element.id] = element;
              }
            });

          return newState;
        }
      }
    }
  }
  if (cleared != null && cleared.includes(action.type)) {
    return {};
  }
  return customBehavior(state, action);
};

export const order = configuration => (state = [], action) => {
  const {
    added,
    fetched,
    replaced,
    removed,
    confirmed,
    cleared,
    sorted,
    idKey = "id",
    preferPrepend = false
  } = configuration;

  const { payload } = action;

  if (added != null && added.includes(action.type)) {
    if (
      typeof payload === "object" &&
      (typeof payload[idKey] === "number" || typeof payload[idKey] === "string")
    ) {
      return !preferPrepend
        ? [...state, payload[idKey]]
        : [payload[idKey], ...state];
    }
  }

  if (fetched != null && fetched.includes(action.type)) {
    if (
      typeof payload === "object" &&
      payload.order != null &&
      payload.order.constructor === Array
    ) {
      const stateSet = new Set(state);
      const difference = payload.order.filter(id => !stateSet.has(id));

      return [...state, ...difference];
    }
  }

  if (replaced != null && replaced.includes(action.type)) {
    if (
      typeof payload === "object" &&
      payload.order != null &&
      payload.order.constructor === Array
    ) {
      return payload.order;
    }
  }

  if (removed != null && removed.includes(action.type)) {
    if (
      typeof payload === "object" &&
      payload.order != null &&
      payload.order.constructor === Array
    ) {
      const stateSet = new Set(state);
      const difference = payload.order.filter(id => !stateSet.has(id));

      return [...state, ...difference];
    }
    if (typeof payload === "number" || typeof payload === "string") {
      return state.filter(id => id !== payload);
    }
    if (typeof payload === "object" && typeof payload[idKey] !== "undefined") {
      return state.filter(id => id !== payload[idKey]);
    }

    return state;
  }

  if (confirmed != null && confirmed.includes(action.type)) {
    if (typeof payload === "object") {
      const { oldId = -1, newId = -1 } = payload;
      return state.map(i => (i === oldId ? newId : i));
    }
    return state;
  }

  if (cleared != null && cleared.includes(action.type)) {
    return [];
  }

  if (sorted != null && sorted.includes(action.type)) {
    if (typeof payload === "object") {
      const { oldIndex, newIndex } = payload;
      if (typeof oldIndex === "number" && typeof newIndex === "number") {
        return arrayMove(state, oldIndex, newIndex);
      }
    }
  }

  return state;
};

export const counter = configuration => (state, action) => {
  const { incremented, decremented, reset } = configuration;

  const { payload } = action;

  if (incremented != null && incremented.includes(action.type)) {
    if (typeof payload !== "undefined") {
      return state + (payload.step || 1);
    }
  }

  if (decremented != null && decremented.includes(action.type)) {
    if (typeof payload !== "undefined") {
      return state - (payload.step || 1);
    }
  }

  if (reset != null && reset.includes(action.type)) {
    return 0;
  }

  return state;
};

export const errors = configuration => (state = {}, action) => {
  const { clear, populate, idKey = "id" } = configuration;
  const { payload } = action;
  if (populate != null && populate.includes(action.type)) {
    if (typeof payload.object_id === "number") {
      return {
        ...state,
        [payload.object_id]: action.payload
      };
    }

    if (
      typeof payload[idKey] === "number" ||
      typeof payload[idKey] === "string"
    ) {
      return {
        ...state,
        [payload[idKey]]: action.payload
      };
    }

    return state;
  }

  if (clear != null && clear.includes(action.type)) {
    if (
      typeof payload[idKey] === "number" ||
      typeof payload[idKey] === "string"
    ) {
      const newState = { ...state };
      delete newState[payload[idKey]];
      return newState;
    }

    return state;
  }

  return state;
};

export const fetching = configuration => (state = [], action) => {
  const { started, succeed, failed, idKey = "id" } = configuration;
  if (started != null && started.includes(action.type)) {
    if (
      typeof action.payload === "number" ||
      typeof action.payload === "string"
    ) {
      return [...state, action.payload];
    }
    if (
      typeof action.payload === "object" &&
      (typeof action.payload[idKey] === "number" ||
        typeof action.payload[idKey] === "string")
    ) {
      return [...state, action.payload[idKey]];
    }

    return state;
  }

  if (failed != null && failed.includes(action.type)) {
    const { payload } = action;
    if (
      payload !== null &&
      typeof payload === "object" &&
      typeof payload.object_id === "number"
    ) {
      return state.filter(id => id !== payload.object_id);
    }

    return state;
  }

  if (succeed != null && succeed.includes(action.type)) {
    const { payload } = action;
    if (
      payload !== null &&
      typeof payload === "object" &&
      (typeof payload[idKey] === "number" || typeof payload[idKey] === "string")
    ) {
      return state.filter(id => id !== payload[idKey]);
    }
    if (typeof payload === "number" || typeof payload === "string") {
      return state.filter(id => id !== payload);
    }

    return state;
  }

  return state;
};

export const isFetching = configuration => (state = false, action) => {
  const { started, succeed, failed } = configuration;
  if (started != null && started.includes(action.type)) {
    return true;
  }

  if (
    (failed != null && failed.includes(action.type)) ||
    (succeed != null && succeed.includes(action.type))
  ) {
    return false;
  }

  return state;
};

export const error = (configuration: ErrorConfigurationType) => (
  state: MAYBE_ERROR_TYPE = {},
  action: ErrorActionType
): MAYBE_ERROR_TYPE => {
  const { clear, populate } = configuration;
  if (clear != null && clear.includes(action.type)) {
    return {};
  }

  if (populate != null && populate.includes(action.type)) {
    return action.payload;
  }

  return state;
};

export const toggle = (configuration: ToggleConfigurationType) => (
  state: boolean = configuration.default,
  action: GENERIC_ACTION_TYPE
): boolean => {
  const { turnedOn, turnedOff } = configuration;
  if (turnedOn != null && turnedOn.includes(action.type)) {
    return true;
  }

  if (turnedOff != null && turnedOff.includes(action.type)) {
    return false;
  }

  return state;
};

export const mux = (configuration: MuxConfigurationType) => (
  state: ID_TYPE = configuration.default,
  action: GENERIC_ACTION_TYPE
): ID_TYPE => {
  const { selected, allDeselected } = configuration;
  if (selected != null && selected.includes(action.type)) {
    if (
      typeof action.payload === "number" ||
      typeof action.payload === "string"
    ) {
      return action.payload;
    }

    return state;
  }

  if (allDeselected != null && allDeselected.includes(action.type)) {
    return configuration.default;
  }

  return state;
};

export const singleton = (configuration: SingletonConfigurationType) => (
  state: ?Object = null,
  action: SingletonActionType
): ?Object => {
  const { clear, populate } = configuration;
  if (clear != null && clear.includes(action.type)) {
    return null;
  }

  if (populate != null && populate.includes(action.type)) {
    return action.payload;
  }

  return state;
};
