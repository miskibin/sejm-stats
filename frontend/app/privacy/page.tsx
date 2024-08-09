import { Card } from "@/components/ui/card";
import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <Card className="container mx-auto px-4 my-3 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        Polityka Prywatności Sejm Stats
      </h1>

      <div className="space-y-6 text-gray-800 dark:text-gray-200">
        <p>
          Witamy w Sejm Stats. Szanujemy Twoją prywatność i zobowiązujemy się do
          jej ochrony. Niniejsza Polityka Prywatności wyjaśnia, jakie informacje
          zbieramy i jak je wykorzystujemy.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Zbierane Informacje</h2>
          <p>
            Przy korzystaniu z naszej aplikacji, zbieramy następujące informacje
            z Twojego konta Google:
          </p>
          <ul className="list-disc list-inside pl-4 mt-2">
            <li>Podstawowy adres e-mail</li>
            <li>Informacje z profilu publicznego</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Wykorzystanie Informacji
          </h2>
          <p>
            Zebrane informacje wykorzystujemy do identyfikacji i autentykacji
            użytkownika.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Ochrona Danych</h2>
          <p>
            Podejmujemy odpowiednie środki bezpieczeństwa, aby chronić Twoje
            dane przed nieautoryzowanym dostępem, zmianą, ujawnieniem lub
            zniszczeniem.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Twoje Prawa</h2>
          <p>Masz prawo do:</p>
          <ul className="list-disc list-inside pl-4 mt-2">
            <li>Dostępu do swoich danych</li>
            <li>Usunięcia swoich danych</li>
            <li>Ograniczenia przetwarzania swoich danych</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
          <p>
            W przypadku pytań dotyczących naszej Polityki Prywatności, prosimy o
            kontakt pod adresem:{" "}
            <a
              href="mailto:mskibinski109@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              mskibinski109@gmail.com
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PrivacyPage;
