import React from "react";
import "./Emoji.scss";
import { Picker } from "emoji-mart";
import { ClickAwayListener, Tooltip } from "@material-ui/core";

function Emoji({
  username,
  innerRef,
  open,
  setOpen,
  placeholder,
  value,
  special,
  ...parentprops
}) {
  const onEmojiClick = (event) => {
    innerRef.current.value = innerRef.current.value + event.native;
  };
  const openemojihandler = () => {
    setOpen(!open);
  };
  const handleClickAway = () => {
    setOpen(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={special ? "InputBox Entry" : "InputBox"}>
        <input
          ref={innerRef}
          placeholder={placeholder + username}
          type="text"
          defaultValue={value}
          className={special ? "Input Color" : "Input"}
          required
          
          {...parentprops}
        ></input>
        <Tooltip title="Emoji" arrow>
          <p onClick={openemojihandler} className="Smile">
            {String.fromCodePoint(0x1f60a)}
          </p>
        </Tooltip>
        {open && (
          <Picker
            style={{
              position: "absolute",
              bottom: special ? null : 40,
              top: special && 0,
              zIndex: 12,
              right: 9,
            }}
            notfound="No Emoji Found"
            perLine={10}
            showPreview={false}
            onSelect={onEmojiClick}
            title="Emoji"
          />
        )}
      </div>
    </ClickAwayListener>
  );
}
export default React.memo(Emoji);
