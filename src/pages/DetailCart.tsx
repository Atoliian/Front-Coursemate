import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonChip, IonLabel, IonText, IonSearchbar, IonGrid,IonRow, IonCol , IonButton} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { SetStateAction, useEffect, useState } from "react";
import { useApiRoutes } from "../components/ApiRoutesContext";
import { bagHandle, close } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import "../styles/pages/detailCart.css";


const DetailCart: React.FC = () => {
 
  let { id } = useParams<{ id: string }>();
  const [cart, setCart] = useState({
    "id": null,
    "entity": null,
    "color": null,
    "name": null,
    "ownerId": null,
    "items": [
      {
        "id": null,
        "entity": null,
        "wording": null,
        "category": {
            "color": null,
            "wording": null
        }
      }
    ],
    "createdAt": null,
    "updatedAt": null,
    "expiredAt": null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  
  const apiRoutes = useApiRoutes();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token_jwt");
        const apiRoute = apiRoutes.getDetailBracket.replace(/:id/g, id);
        const response = await fetch(apiRoute, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajoutez l'en-tête d'autorisation avec le jeton Bearer
          },
        });
        const jsonData = await response.json();
        setCart(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        history.push("/login");
        window.location.reload();
      }
    };

    fetchData();
  }, [apiRoutes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(searchTerm.length > 2){
          const token = localStorage.getItem("token_jwt");
          const apiRoute = apiRoutes.getSearchItem.replace(/:search/g, searchTerm);
          const response = await fetch(apiRoute, {
            headers: {
              Authorization: `Bearer ${token}`, // Ajoutez l'en-tête d'autorisation avec le jeton Bearer
            },
          });
          const jsonData = await response.json();
          if(jsonData.items.length > 0){
            //const wordings: string[] = jsonData.items.map((item: any) => item.wording);
            setSearchResults(jsonData.items);
        }
        console.log(jsonData.items);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const addItem =  async (newItem: any) => {
    if(cart.id != null){
      const token = localStorage.getItem("token_jwt");
      const apiRoute = apiRoutes.addItemInBracket.replace(/:id/g, cart.id);
      const response = await fetch(apiRoute, {
        method: 'PUT',
        body: JSON.stringify(newItem),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

      // Ajouter le nouvel élément à la liste des articles dans l'état cart
      const updatedCart = { ...cart, items: [...cart.items, newItem] };
      setCart(updatedCart);
    }
    
  };
  
  const removeItem =  async (item: any) => {
    if(item.id != null && cart.id != null){
      const token = localStorage.getItem("token_jwt");
      const apiRoute = apiRoutes.removeItemInBracket.replace(/:id/g, cart.id);
      const response = await fetch(apiRoute, {
        method: 'PUT',
        body: JSON.stringify({id : item.id}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }

       // Filtrer les articles pour supprimer celui avec l'ID correspondant
       const filteredItems = cart.items.filter((cartItem: any) => cartItem.id !== item.id);
       // Mettre à jour l'état cart avec la nouvelle liste d'articles filtrée
       const updatedCart = { ...cart, items: filteredItems };
       setCart(updatedCart);
    }
    
  };

  const insertUnknownItem = async (wording: string) => {
    const uuid = uuidv4();
    const unknownItem = {
        "id": `${uuid.substr(0, 8)}-${uuid.substr(9, 4)}-${uuid.substr(14, 4)}-${uuid.substr(19, 4)}-${uuid.substr(24)}`,
        "entity": "Item_unknown",
        "wording": wording.charAt(0).toUpperCase() + wording.slice(1),
        "category": {
            "color": null,
            "wording": null
        }
    }
    addItem(unknownItem);
  }
  
  return (
    <IonPage className='content'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{cart.id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{cart.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar animated={true} placeholder="Ajouter un article" value={searchTerm}
          onIonChange={e => setSearchTerm(e.detail.value || '')}
          onIonClear={e => setSearchResults([])}
          ></IonSearchbar>
        <IonGrid>
        <IonRow>
        {searchResults.length > 0 ? (
            // Si cards contient des données, parcourez-le et affichez le composant Card pour chaque élément
            searchResults.map((searchItem, index) => (
              <IonCol className='searchItem' key={index}>
                <IonButton size='small' onClick={() => addItem(searchItem)}>{searchItem.wording}</IonButton>
              </IonCol>
            ))
          ) : (
            // Si cards est vide, affichez un message ou un composant de chargement
            searchTerm.length > 2 ? (
              <IonCol className='searchItem'>
                <IonButton size='small' onClick={() => insertUnknownItem(searchTerm)}>{searchTerm}</IonButton>
              </IonCol>
            ) : null
          )
        }
        </IonRow>
      </IonGrid>
        {cart.items.length > 0 ? (
            // Si cards contient des données, parcourez-le et affichez le composant Card pour chaque élément
            cart.items
              .slice() // Créez une copie du tableau pour éviter de modifier l'ordre original
              .sort((a, b) => (a.wording.toLowerCase()).localeCompare(b.wording.toLowerCase()))
              .map((item, index) => (
              <IonChip key={index}>
                <IonIcon icon={bagHandle} color="primary"></IonIcon>
                <IonLabel>{item.wording}</IonLabel>
                <IonIcon icon={close} onClick={() => removeItem(item)}></IonIcon>
              </IonChip>
            ))
          ) : (
            // Si cards est vide, affichez un message ou un composant de chargement
            <IonText>Aucun article disponible.</IonText>
          )}

      </IonContent>
    </IonPage>
  );
};

export default DetailCart;

