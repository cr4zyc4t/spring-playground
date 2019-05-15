import React, { useCallback, memo } from "react";
import s from "./ListItem.module.css";
import logo from "./logo.svg";

export default memo(function ListItem({ title, onClick, id }) {
  console.log("ToanVQ: ListItem -> ListItem");
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);
  return (
    <div className={s["list-item"]}
      onClick={handleClick}
    >
      <div className={s["logo"]}>
        <img src={logo} className={s["logo-svg"]} alt="logo" />
      </div>
      <div className={s["title"]}>{title}</div>
    </div>
  );
}, (prev, next) => {
  const diff = Object.keys(prev).filter(k => {
    return prev[k] !== next[k];
  });
  return diff.length === 0;
});