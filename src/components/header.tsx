import * as React from "react";

import { Button } from "./ui/button";
import { getLocalStorage } from "@/utils/localStorage";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Header = () => {
  const [userName, setUserName] = React.useState("");
  const me = getLocalStorage("me");

  React.useEffect(() => {
    if (userName === "") {
      const user = JSON.parse(me);
      setUserName(user.name);
    }
  }, [me, userName]);

  return (
    <div className="flex flex-1 justify-between mb-4">
      <Button
        variant="ghost"
        className="ml-[-0.5rem] hover:ml-[0rem] transition-all"
      >
        Realiza Web
      </Button>
      <Button variant="ghost">{userName}</Button>
    </div>
  );
};

Header.displayName = "Header";

export { Header };
