# Już prawie!


Cześć, nadszedł czas na 2 devlog z projektu sejm-stats - czyli aplikacji, która naprawia wszystko
co jest nie tak z oficjalną stroną sejmową i dodaje do tego  nowe ciekawe funkcjonalności. 
 mimo studiów magisterskich, 
które starają mi się udowodnić, że jedyne co powinienem robić to sprawozdania 
Ostatnie 2 tygodnie były wyjątkowo intensywne. 
Strona doczekała się nowej szaty graficznej, widoku interpelacji, obsługi komisji sejmowych i analizy ich posiedzeń,  
a takze udało mi się dokończyć widok przebiegu procesów legislacyjnych.
Przedewszystkim jednak udało mi się przepisać rdzeń aplikacji. 
Dotychczas dane pobierane były przy uruchamianiu aplikacji i zajmowało to za każdym razem pare minut. W fazie rozwoju aplikacji nie potrzebowałem 
aktualizować tych danych codziennie więc nie było z tym problemu, jeśli jednak chce aby aplikacja
była dostępna publicznie dane powinny być aktualizowane asynchronicznie. Powiedzieć łatwiej niż zrobić.

Przykładowo Abyśmy mogli oglądać widok komisji sejmowych - trzeba:
1. Pobrać dane o komisjach sejmowych i połączyć listę członków z obiektami posłów w bazie danych. Oczywiście często otrzymane dane są wybrakowane i wadliwe.
2. Potem dla każdej komisji musimy pobrać dane o jej posiedzeniach, Przetworzyć tytuły tych posiedzeń, które napisane są w kodzie html xd jestem przekonany, że jest to kwestia technologii z przyszłości, w której to zapisuje się html-a w bazie danych. Jak juz uda nam się przetłumaczyć kod na tekst, z tytułów trzeba wywnioskować jakie druki były na posiedzeniu i przypisać obiekty druków z naszej bazy danych do posiedzenia. Tutaj znowu może się okazać, że rozpatrywane były druki usnięte, których siłą rzeczy nie ma w naszej bazie danych.
3. Po tym wszystkim fajnie było by móc obejrzeć to posiedzenie. Tak więc wyciągamy video_id z odpowiedzi wysyłamy zapytanie o to video, i dopiero tam znajdujemy link do filmu. 

Takich modeli w bazie danych mamy kilkanascie. Na szczęście całą tą pracę mam już za sobą. Teraz wystarczy kliknąć przycisk i dane same sięaktualizują, a użytkownik dostanie informację, kiedy to się stało.

Obok tego widzice przycisk, wesprzyj mnie na patronite, którego założyłem sugerując się komentarzami pod porzednimi filmami. Aplikacja na swobodne działanie będzie potrzebowała wkładu min 100zł miesięcznie.
Link do patronite w opisie. 
 
Po tych parunatstu godzinach aplikacja jest prawie gotowa do wypuszczenia, muszę tylko dodać ekran ładowania i zoptymalizować inteligentne wyszukiwanie. 

Pod ostatnim filmem zasugerowaliście wiele bardzo ciekawych usprawnień, pare osób napisało nawet do mnie maila. Wszystkie wasze pomysły zapisuję sobie w projekcie i co ciekawsze postaram się zrealizować. Moim następnym krokiem poza rozwiązywaniem problemów, będzie dodanie modułu logowania przy pomocy google, tak byśmy mogli tworzyć społeczność. Ponadto było by super gdyby ktoś z was zechciał pisać artykuły w aplikacji. W połączeniu z możliwością komentowania i oceniania elementów na stronie, mogłoby się to przyczynić do stworzenia społeczności, która sama by decydowała o kierunku rozwoju aplikacji.  

Z wykształcenia jestem inżynierem danych, na studiach nauczyłem się, że zebranie tych danych to tylko początek zabawy. Mając informacje kto wspólnie podpisuje projekty, zasiada w komisjach sejmowych etc. Możemy łatwo zbudować sieć powiązań między posłami. Dzięki temu wiadomo będzie kto z kim sympatyzujem, jacy posłowie mają podobne poglądy. Może zagłosowałbyś na posła A, ale nieodpowiada ci jego osobość, wtedy możesz zagłosować na posła B, który znajduje się najbliżej posła A w sieci powiązań. Co o tym myślicie? Jak zawsze 