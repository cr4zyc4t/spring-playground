import React, { Component } from "react";
import faker from "faker";
import ListItem from "./ListItem";
import s from "./AnimatedList.module.css";
import { Transition, animated } from "react-spring/renderprops";
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

export default class AnimatedList2 extends Component {
  state = {
    list: defaultList,
    removed: [],
  }

  handleClick = (itemId) => {
    this.setState(({ removed, list }) => {
      const removedItem = find(list, item => item.id === itemId);
      if (removedItem) {
        return {
          list: list.filter(item => item.id !== itemId),
          removed: [...removed, removedItem],
        };
      }
      return null;
    });
  }

  handleUndo = () => {
    this.setState(({ removed, list }) => {
      const undoItem = removed[removed.length - 1];
      // console.log("ToanVQ: handleUndo -> undoItem", undoItem);
      if (!undoItem) {
        return null;
      }
      const insertIdx = findIndex(list,item => item.id > undoItem.id);
      return {
        list: [...list.slice(0, insertIdx), undoItem, ...list.slice(insertIdx, list.length)],
        removed: removed.slice(0, removed.length - 1),
      };
    });
  };

  render() {
    const { list } = this.state;

    return (
      <div>
        < button onClick={this.handleUndo} > Undo</button >
        <div className={s["animated-list"]}>
          {
            <Transition
              native
              items={list}
              keys={item => item.id}
              from={{ height: 0 }}
              enter={{ height: 75 }}
              leave={{ height: 0 }}
              unique
            >
              {
                (item, state, index) => props => {
                  // console.log("ToanVQ: render -> item, state, index", index);
                  return (
                    <animated.div className={s["item-container"]} style={props} key={item.id}>
                      <ListItem
                        id={item.id}
                        title={item.title}
                        onClick={this.handleClick}
                      />
                    </animated.div>
                  );
                }
              }
            </Transition>
          }
        </div>
      </div >
    );
  }
}