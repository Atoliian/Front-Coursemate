import React, { useState, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonIcon, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';

interface CartData {
  bracket: {
    id: number | null,
    entity: string | null,
    color: string | null,
    name: string | null,
    ownerId: number | null,
    items: any[], // Ou Array<any> si vous préférez
    createdAt: Date | null, // Si la date peut être null
    updatedAt: Date | null, // Si la date peut être null
    expiredAt: Date | null // Si la date peut être null
    // Ajoutez d'autres clés et types au besoin, en les rendant nullable si nécessaire

  };
}

const Cart: React.FC<CartData> = ({ bracket }) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [nbExpiration, setNbExpiration] = useState<number>(1);

  useEffect(() => {
    const getRandomColor = () => {
      // Génération d'une couleur aléatoire au format hexadécimal
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    };

    setBackgroundColor(getRandomColor()); // Met à jour la couleur de fond lors du montage du composant
  }, []); 

  useEffect(() => {
    if (bracket.expiredAt !== null) {
      const nb = dayBeforeExpiration(bracket.expiredAt);
      setNbExpiration(nb);
    }
  }, [bracket.expiredAt]);

  function getExpirationColor(nb: number) {
    return nb <= 1 ? 'red' : 'green';
  }

  function dayBeforeExpiration(dateExpiration: Date): number {
    const expiredAtDate: Date = new Date(dateExpiration);
    const now = new Date(); // Date actuelle
    const between = expiredAtDate.getTime() - now.getTime(); // Différence en millisecondes
    const days = Math.ceil(between / (1000 * 3600 * 24)); // Convertir la différence en jours arrondis
    return days;
  }


  return (
      <IonItemSliding className="swipe-options">
        <IonCard>
          <IonItem className={`background-color-${backgroundColor}`}>
            <IonCardHeader>
              <IonCardTitle>{bracket.name}</IonCardTitle>
              <IonCardSubtitle>{bracket.items == null ? 0 : bracket.items.length} article(s)</IonCardSubtitle>
              <IonCardSubtitle style={{'color': getExpirationColor(nbExpiration)}}>Expire dans {nbExpiration} jours</IonCardSubtitle>
            </IonCardHeader>
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption onClick={() => console.log(`Modifier ${bracket.id}`)} className="modify-option">
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonItemOption>
            <IonItemOption onClick={() => console.log(`Supprimer ${bracket.id}`)} className="delete-option">
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonCard>  
    </IonItemSliding>
    
  );
};

export default Cart;
