A co gdyby można było jednym kliknięciem zweryfikować wiarygodność artykułów w czasopismach internetowych? 
Sprawdzić jak głosował konkretny poseł w najważniejszych głosowaniach a to wszystko korzystając z przyjaznej aplikacji internetowej?  
To są pytanie, na które odpowiedzieliśmy sobie w minionym miesiącu. 

W tym tygodniu w sejm-stats, czyli stronie, którą buduję od ponad roku, by poprawić przejrzystość danych o naszym rządzie, dodaliśmy system, do pisani
a artykułów. Ale dlaczego nasze artykuły będą lepsze od tych pisanych na wp.pl czy też na onecie?
Nasza inicjatywa jest oddolna. Osoby piszące artykuły na naszej stronie nie mają narzucone by faworyzować konkretną opcję polityczną, lub przemilczeć określone tematy. Jedyny wymóg jest taki, by artykuły były bezstronne i obiektywne.  Nie musisz wierzyć mi na słowo! Możesz to zweryfikować. Wszystkie dane na sejm-stats poza artykułami pochodzą z oficjalnej strony polskiego sejmu . Nigdy nie było łatwiej zweryfikować informacji w artykule niż u nas - Klikasz i wiesz.
Szczególne podziękowania do Andriego, który zaimplementował całą tą funkcjonalność.

Jeśli pamiętacie jak wyglądała strona po ostatnim devlogu miesiąc temu, to napewno zauważyliście, że zmieniło się praktycznie wszystko. 
Strona jest czytelniejsza i bardziej minimalistyczna, spójna, a jednocześnie zawiera więcej informacji. Do tego w wielu scenariuszach ładuje się szybciej. 
Dzięki wykorzystaniu biblioteki MDB pro udało mi się między innymi. Dodać zintegorwane wykresy, asynchroniczne tabelki, rozwijane z boku menu i inne. A to wszystko przy zredukowanej ilości kodu. Lista zmian  w UI jest bardzo długa. Została zaprojektowana przez Adama Markowskiego i Marcina Blicharskiego i zaimplementowana przeze mnie. 

Projekt na pewno rozwija się szybciej niż się tego spodziewałem. Po ostatnim filmie udało przekroczyć się próg 1000 złotych miesięcznego wsparcia za co bardzo dziękuję. To dzięki wam mogę swobodnie poświęcać czas na rozwijanie projektu i opłacić narzędzia do jego rozwoju. Poza tym, pojawiło się pare niezależnych postów na różnych forach, które zwróciły uwagę na projekt. 

Poza przytłaczającą ilością osób wspierających mój projekt finansowo i developersko - pojawiło się też kilka osób krytykujących pomysł. Mówiono na przykład, że ludzie zainwestują swój czas i pieniądze a mi się poprostu odechce. Mam dla was złą wiadomość. Przywiązałem się do projektu nierozerwalną więzią na rok. 

Przez najbliższy rok będę pisał pracę dyplomową na temat "porównania modeli sztucznej inteligencji do streszczeń ustaw". Wyniki pracy oczywiście zostaną zintegrowane z aplikacją. 

Jeśli tak jak mi wydawało ci się że projekt to tylko pisanie kodu, to byłeś w błędzie. W ostatnich tygodniach:
 
1. Z pomocą użytkownika jaykay udało skonfigurować się serwer discord.
2. Rozpisana została roadmapa do 1 stabilnej wersji aplikacji. 
4. Stworzony został sejm-stats gpt. Który to dysponując wiedzą o projekcie pomaga mi w rozwijaniu go.
5. Odświeżony został profil na patronite. 
I inne. 


Jak zawsze chciałbym opowiedzieć trochę o najciekawszym wyzwaniu technicznym z minionego miesiąca. 
Tym razem jest to wyszukiwanie AI. Jest to dużo prostsze niż brzmi. 


1. Krokiem jest wektoryzacja słów - czyli zamiana słów (lub całych zdań) na listę liczb. Popatrzmy na uproszczony przykład. Wyobraźmy sobie, że mamy zwierzęta i 2 wymiarowy układ współrzędnych. Im dalej na osi X tym groźniejsze jest zwierze i im dalej na osi y tym jest większe. Mamy więc kolejno małą i słabą mysz, troche większego psa i groźniejszego psa i tak dalej. Wiadomo że najgroźniejszym zwierzęciem jest jamnik więc będzie on najdalej na osi X. 
2. Jak już nadamy wartości każdemu ze zwierząt możemy wyszukiwać podobne zwierzęta. Wyobraźmy sobie że użytkownik wpisuje frazę "wilk". Wyszukiwarka AI znajduje wilka i 2 najbliższe wilkowi zwierzęta czli psa i lwa. 
W rzeczywistości takie układy współrzędnych mają nawet pare tysięcy wymiarów, a wymiary te są czasem trudne do zdefiniowania. Warto dodać, że liczenie najbliższych sąsiadów jest bardzo wydajne. Wystarczy do tego jedna operacja macierzowa. Niestety nie istnieją dobre modele dla języka polskiego, dlatego prawdopodobnie wyszukiwanie zostanie zaimplementowane korzystając z wordnetu, ale to już temat na inny film, a może nawet artykuł na sejm-stats. 


Jak zawsze dziękuję za wsparcie i zachęcam do włączenia się w projekt.