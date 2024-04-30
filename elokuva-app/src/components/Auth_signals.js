import { effect, signal } from "@preact/signals-react"; // asenna auth signals-react

export const jwtToken = signal(getToken()); // tästä lähetetään jwt token, joka saadaan funktiolla

// funktio, joka hakee tokenin sessionStoragesta. Istunnon ajan käyttäjätunnus pysyy hallussa
function getToken() {
  const token = sessionStorage.getItem("token");
  return token === null || token === "null" ? "" : token;
}

// tällä asetetaan token sesstionStorageen
effect(() => {
  sessionStorage.setItem("token", jwtToken.value);
});
