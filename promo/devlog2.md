# devlog 2

<!-- Cześć mimo studiów magisterskich, które starają mi się udowodnić, że jedyne co powinienem robić to sprawozdania. Oraz pracy, przez ostatnie 3 tygodnie walczyłem z niewydolnym systemem informatycznym sejmu i odniosłem pare sukcesów. -->

Cześć, dziś chciałbym zrobić przegląd funkcjonalności, w moim projekcie sejm-stats - czyli aplikacji, która rosrzerza funkcjonalność oficjalnej strony sejmowej. 

Wszystkie funkcjonalności o których dziś opowiem opisane są w dokumentacji, do której link znajdziecie w opisie filmu.

Tak więc zaczynając od najbardziej podstawowych funkcjonalności. 

Aplikacja pozwala na przeglądanie listy posłów, wraz z możliwością filtrowania po klubie, okręgu wyborczym i oczywiście imieniu i nazwisku.

Poza tym możemy prześledzić, którzy z posłów są najbardziej aktywni i dlaczego...

#### mentzen here

Sprawdźmy, czy to prawda. 
Pan Zbigniew hoffman złożył ponad 153 interpelacje. W jakich sprawach. 
To by się zgadzało zapytał o zabytki w 118 różnych gminach. Musi być bardzo zaangażowany w temat.

Skoro weszliśmy już profil w posła to wytłumaczmy sobie co można tu sprawdzić.

1. Po pierwsze mamy życiorys, który jako, że sejm nie udostępnia nam tych danych, jest pobierany z wikipedii. Przycisk przekieruje nas do strony wikipedii.
2. Po 2 możemy z wysłać maila do posła, mam nadzieję, że nie będzie się to kończyło nękaniem posłów przez internautów.
3. Można zaobserwować posła, co w przyszłości będzie wiązało się z otrzymywaniem powiadomień o jego aktywności. 
4. Możemy prześledzić jak poseł głosował w różnych sprawach. Pod jakimi projektami się podpisał jakie interpelacje składał i czy głosował zgodnie z linią partii.
5. W przyszłości planuję dodać tutaj informację ze sprawozdania finansowego, ale jako, że niektórzy posłowie piszą jakby nie chcieli, żeby to było jawne, wymaga to trochę więcej czasu.
(sprawozdanie here)

### Dalej mamy pare widoków, poprostu do przeglądania danych. 
- Widok aktów prawnych z dynamicznym wyszukiwaniem i filtrowaniem.
- widok procesów legislacyjnych, tutaj możemy też zobaczyć jak się ma zamrażarka sejmowa i czy jest w niej jeszcze miejsce na uszka do barszczu.
- Jeszcze nie skończony widok głosowań.
- i widok klubów parlamentarnych. 

Oczywiście wszystkie te widoki możemy przeglądać w przecudownym trybie ciemnym a cała strona jest responsywna, to znaczy skaluje się na urządzeniach mobilnych. 


Poza tym w każdym widoku mamy możliwość przejścia do oficjalnych dokumentów zwiazanych z danym tematem.

### Przyjrzyjmy się teraz trochę ciekawszym tematom. 

- Prawdopodobnie większości potencjalnych użytkowników nie będzie interesować konkretny poseł, tylko temat. Zapraszam więc na stronę główną. Tutaj możemy wpisać dowolne hasło w wyszukiwarce a nasz baza danych zostanie przeszukana z użyciem sztucznej inteligencji. 
Załużmy, że interesuje mnie temat ukrainy. Wpisuję hasło `ukraina, rosja, wojna`  
 i oto on.

Na wykresach widzimy kolejno posłów najbardziej zaangażowanych w temat (do wykresu dodam jeszcze informcję dot projektów ustaw i uchwał związanych z tematem). Dalej zainteresowanie tematem w czasie i zainteresowanie ze względu na klub parlamentarny. (wykres też czeka na poprawki).

Niżej wszelakie projekty, obowiązujące akty prwawne i interpelacje związane z tematem.
Planuję dodanie możliwości subskrypcji tematu, żeby użytkownik mógł być na bieżąco z nowymi informacjami.

### Skoro opowiedziliśmy sobie o podstawowych funkcjonalnościach chciałbym podzielić się z wami elementami eksperymentalnymi.

Problem jest taki, że nie jestem jeszcze określić w jaką stronę chciałbym iść z projektem.

Pomyślałem na przykład, że system mógłby być np. hybrydą pomiędzy serwisem informacyjnym a narzędziem do analizy danych. 

Stworzyłem widok artykuły, z myślą o tym aby każdy artykuł przypisany był do klubów parlamentarnych, posłów, tematów, aktów prawnych i procesów legislacyjnych. Artykuły można by dodawać nie dysponując wiedzą techniczną. A użytkownicy mogliby je oceniać i komentować. Wymagało by to jednak redaktrów zaangażowanych w projekt.

Dużo mniej pracy redakcyjnej wymagałoby prowadzenie widoku `afery rządowe`. Gdyby ktoś na bieżąco dodawał tam wszystkie afery i przypisywał je do posłów, klubów, tematów może duże afery nie odchodziły by w zapomnienie po 2 tygodniach. Tutaj również pojawia się problem z redakcją.

Ponieważ strona ma być bezstronna, chciałbym maksymalnie możliwie zwiększyć transparentność. Dodałem więc sekcje faq, gdzie będę odpowiadał na pytania, które dostaję od użytkowników.


Dajcie znać jeśli macie jakieś pomysły na rozwój projektu.

Aplikacja nadal nie jest dostępna publicznie ponieważ wymgało by to ode mnie nakładu finansowego. 
Mam jednak przygotowanego docker-a i jestem gotowy do hostowania jej na AWS-ie.

