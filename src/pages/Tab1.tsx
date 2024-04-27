import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "../styles/pages/Tab1.css";
import { bagAdd } from "ionicons/icons";
import Cart from "../components/tab1/Cart";
import { useEffect, useState } from "react";
import { useApiRoutes } from "../components/ApiRoutesContext";
import { useHistory } from "react-router-dom";

// Tab one groups together all the user's baskets
const Tab1: React.FC = () => {
  const apiRoutes = useApiRoutes();
  const history = useHistory();

  const [carts, setCarts] = useState<[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token_jwt");
        const response = await fetch(apiRoutes.getMyBrackets, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajoutez l'en-tête d'autorisation avec le jeton Bearer
          },
        });
        const jsonData = await response.json();
        setCarts(jsonData.brackets);
      } catch (error) {
        console.error("Error fetching data:", error);
        history.push("/login");
        window.location.reload();
      }
    };

    fetchData();
  }, [apiRoutes]);


  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Mes paniers</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonTitle size="large">Mes paniers</IonTitle>
                </IonCol>
                <IonCol>
                  <IonButton expand="block">
                    <IonIcon slot="icon-only" icon={bagAdd}></IonIcon>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {carts.length > 0 ? (
            // Si cards contient des données, parcourez-le et affichez le composant Card pour chaque élément
            carts.map((cartData, index) => (
              <Cart key={index} bracket={cartData}/>
            ))
          ) : (
            // Si cards est vide, affichez un message ou un composant de chargement
            <IonText>Aucune carte disponible.</IonText>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
