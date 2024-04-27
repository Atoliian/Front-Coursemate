import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent, IonInput, IonButton, IonItem, IonTitle } from "@ionic/react";
import { useApiRoutes } from "../components/ApiRoutesContext";
import "../styles/pages/login.css"; // Importation du fichier de styles CSS personnalisés
import * as Yup from "yup";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<null|string>(null);
  const emailRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);
  const apiRoutes = useApiRoutes();
  const history = useHistory();

  function handleLogin(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
  
    const loginData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
  
    LoginSchema.validate(loginData, { abortEarly: false })
      .then(async () => {
        try {
          // Effectuer une requête POST avec les données de connexion
          const response = await fetch(apiRoutes.getLogin, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          });
    
          if (!response.ok) {
            // Si la requête a échoué, afficher une erreur
            throw new Error("Erreur de connexion");
          }
    
          // Si la requête a réussi, récupérer les données de l'utilisateur
          const jwt = await response.json();
    
          // Stocker les informations de l'utilisateur dans le localStorage
          localStorage.setItem("token_jwt", jwt);

          try {
            
            const response = await fetch(apiRoutes.getMyInformations, {
              headers: {
                Authorization: `Bearer ${jwt}`, // Ajoutez l'en-tête d'autorisation avec le jeton Bearer
              },
            });
            const jsonData = await response.json();
            // Stocker les informations de l'utilisateur dans le localStorage
            localStorage.setItem("me", JSON.stringify(jsonData));
            // Rediriger l'utilisateur vers la page d'accueil ou toute autre page appropriée
            history.push("/my-carts");
            window.location.reload();
          } catch (error){
            setLoginError("Une erreur est survenue à la récuperation de vos informations." );
          }
          
        } catch (error) {
            setLoginError("Une erreur est survenue lors de la connexion." );
        }
      })
      .catch((err) => {
        const validationErrors: { [key: string]: string } = {};
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e) => {
            if (e.path !== undefined) {
              validationErrors[e.path] = e.message;
            }
          });
          setErrors(validationErrors);
        }
      });
  }
  

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Adresse email invalide").required("Champ requis"),
    password: Yup.string().required("Champ requis"),
  });

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <div className="title-container">
            <IonTitle size="large" className="title">Cousemate</IonTitle>
            <IonTitle size="small" className="subtitle">Connectez-vous</IonTitle>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <IonItem>
              <IonInput
                ref={emailRef}
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                color="light"
                type="email"
                placeholder="Adresse email"
                clearInput
              ></IonInput>
              {errors && errors.email && <div>{errors.email}</div>}
            </IonItem>

            <IonItem>
              <IonInput
                ref={passwordRef}
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                color="light"
                type="password"
                placeholder="Mot de passe"
                clearInput
              ></IonInput>
              {errors && errors.password && <div>{errors.password}</div>}
            </IonItem>
            <div style={{color: "red", marginTop: "20px" }}>{loginError}</div>
            <IonItem lines="none">
              <IonButton color="light" slot="end" fill="clear">Mot de passe oublié ?</IonButton>
            </IonItem>
            <IonButton color="light" expand="full" shape="round" fill="outline" type="submit" className="btn-connexion">Connexion</IonButton>
            <IonButton color="tertiary" expand="full" shape="round" className="btn-register">Inscription</IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
