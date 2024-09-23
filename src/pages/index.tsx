import { API_USER_LOGIN_URL } from "@/config/api";
import { LOGIN_REDIRECT_URL } from "@/config/urls";
import { isEmailValid, isValidPassword } from "@/utils/validate";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const [typeError, setTypeError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    setData({ ...data, [input]: (e.target as HTMLInputElement).value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, input: string) => {
    e.preventDefault();
    switch (input) {
      case "email":
        setErrors({
          ...errors,
          [input]: !isEmailValid((e.target as HTMLInputElement).value),
        });
        break;
      case "password":
        setErrors({
          ...errors,
          [input]: !isValidPassword((e.target as HTMLInputElement).value),
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTypeError("");
    const formData = data;
    const formErrors = {
      email: !isEmailValid(formData.email),
      password: !isValidPassword(formData.password),
    };
    setErrors(formErrors);
    const isFormValid = Object.keys(formErrors).every(
      (key) => !formErrors[key as keyof typeof formErrors]
    );

    if (isFormValid) {
      setIsLoading(true);
      axios
        .post(API_USER_LOGIN_URL, {
          identifier: data.email,
          password: data.password,
        })
        .then((response: any) => {
          console.log("response.data", response.data);
          localStorage.setItem("me", JSON.stringify(response.data.user));
          localStorage.setItem("jwt_token", response.data.jwt);
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("userBearer", response.data.jwt);
          router.push(LOGIN_REDIRECT_URL);
          setIsLoading(false);
        })
        .catch((error: any) => {
          setIsLoading(false);
          setTypeError(error.response.data.error.name);
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col align-center space-y-4"
      >
        <Label className="mb-4 text-2xl">Realiza Web</Label>
        <Label>Login</Label>
        <Input
          onBlur={(e) => handleBlur(e, "email")}
          onChange={(e) => handleChange(e, "email")}
          placeholder="E-mail"
          type="email"
          className="input-form px-2 py-2"
          disabled={isLoading}
        />
        <Input
          onBlur={(e) => handleBlur(e, "password")}
          onChange={(e) => handleChange(e, "password")}
          placeholder="Senha"
          type="password"
          className="password-form px-2 py-2"
          disabled={isLoading}
        />
        {typeError && (
          <span className="text-xs text-red-600">
            E-mail ou senha incorretos, tente novamente.
          </span>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && "Enter"}
        </Button>
      </form>
    </main>
  );
}
