import React, { useCallback, useReducer } from "react";
import faker from "faker";
import ListItem from "./ListItem";
import s from "./AnimatedList.module.css";
import { useTransition, animated } from "react-spring";
import range from "lodash/range";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

const defaultList = range(20).map((v, i) => {
  return {
    title: `${i}.${faker.name.findName()}`,
    id: `id${i}`,
    show: true,
  };
});

const reducer = (state, { type, payload }) => {
  const { list, removed } = state;
  switch (type) {
    case "remove": {
      const itemId = payload.itemId;
      const removedItem = find(list, item => item.id === itemId);
      if (removedItem) {
        return {
          list: list.filter(item => item.id !== itemId),
          removed: [...removed, removedItem],
        };
      }
    }
      break;
    case "undo": {
      const undoItem = removed[removed.length - 1];
      if (undoItem) {
        const insertIdx = findIndex(list, item => item.id > undoItem.id);
        return {
          list: [...list.slice(0, insertIdx), undoItem, ...list.slice(insertIdx, list.length)],
          removed: removed.slice(0, removed.length - 1),
        };
      }
    }
      break;
    default:
      break;
  }
  return state;
};

export default function AnimatedList() {
  const [{ list }, dispatch] = useReducer(reducer, { list: defaultList, removed: [] });

  const transitions = useTransition(list, item => item.id, {
    from: {
      height: 0,
      // opacity: 1,
    },
    enter: [
      { height: 75 },
      // { opacity: 1 },
    ],
    leave: [
      { height: 0 },
      // { opacity: 0 },
    ],
    unique: true,
  });
  const handleClick = useCallback((itemId) => {
    dispatch({ type: "remove", payload: { itemId } });
  }, []);
  const handleUndo = useCallback(() => {
    dispatch({ type: "undo" });
  }, []);

  return (
    <div>
      <button onClick={handleUndo}>Undo</button>
      <div className={s["animated-list"]}>
        {
          transitions.map(({ item, props, key }) => {
            return (
              <animated.div className={s["item-container"]} style={props} key={key}>
                <ListItem
                  id={item.id}
                  title={item.title}
                  onClick={handleClick}
                />
              </animated.div>
            );
          })
        }
      </div>
    </div>
  );
}