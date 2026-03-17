// merchantData.js
// Data banks and tables for the Merchant Generator.
// Name banks are keyed by species/creature subtype (populated in Phase M5).
// Appearance bank is a flat array — applies to all species/creature types (Phase M5).
// Quirk bank is a flat array (populated in Phase M6).
// Backgrounds, personalities, biases, species, and creature tables are fully hardcoded.

// ---------------------------------------------------------------------------
// Name banks — keyed by species/creature subtype. Populated in Phase M5.
// ---------------------------------------------------------------------------

const MERCHANT_NAMES = {
  human: [
    "Aldric","Brenna","Corvin","Darius","Elric","Fenn","Garrick","Harlan","Ivor","Jessa",
    "Kellan","Lysa","Marek","Nolan","Orin","Perrin","Quinn","Ronan","Soren","Tarin",
    "Ulric","Vera","Warren","Xander","Yorick","Zane","Alina","Bastian","Cedric","Delia",
    "Eamon","Fiora","Galen","Helena","Isolde","Jareth","Kael","Lorian","Mira","Nessa",
    "Olin","Petra","Quentin","Rhea","Stefan","Tessa","Uriah","Valen","Willow","Xara",
    "Yvette","Zorin","Arlen","Bran","Cyrus","Davin","Edric","Faris","Gavin","Hector",
    "Jorin","Kara","Luther","Magnus","Nadia","Oskar","Pavel","Risa","Seren","Torin",
    "Ulla","Vance","Willa","Xavian","Yara","Zarek","Ansel","Brina","Cassian","Della",
    "Eldric","Fara","Gideon","Hilda","Ivana","Joran","Kira","Lina","Marius","Nira",
    "Orrin","Pella","Roderic","Sabra","Theron","Una","Varek","Wystan","Yorin","Zella"
  ],

  halfElf: [
    "Aelindra","Soren","Lyra","Caelith","Elorien","Faelar","Ilyra","Kaelen","Lethar",
    "Myrian","Naeris","Orelion","Phaedra","Quarion","Rilith","Sylvar","Thalion",
    "Vaelis","Xilara","Ylith","Zaerith","Aerin","Belion","Cyrindra","Daelis","Elarion",
    "Felyn","Gaelira","Haelis","Ithir","Jhaeros","Kaelis","Laerith","Maelis","Nyris",
    "Olyndra","Paelion","Qilara","Raelis","Saelion","Taelis","Ulaeris","Vaelith",
    "Wynriel","Xaelis","Yrael","Zaelis","Aerith","Belira","Caelis","Daerion","Elaris",
    "Faelis","Gaelion","Haelith","Irael","Jorael","Kaerion","Laelis","Maerion","Naelith",
    "Oraelis","Paeris","Qyrael","Raelis","Saerion","Taerith","Ulion","Vaerion","Wynelis",
    "Xaerith","Yraelis","Zaerion","Aeris","Belith","Caerion","Daelis","Elyra","Faerion",
    "Gaeris","Haerion","Iraelis","Jhaelis","Kaerith","Laerion","Maelis","Naeris",
    "Oraeth","Paelis","Qarael","Raelion","Saelis","Taelion","Urael","Vaelis","Wynra",
    "Xaelis","Yraelis","Zaeris"
  ],

  halfOrc: [
    "Grusk","Thokk","Rogar","Morga","Drask","Vorga","Krann","Zugra","Brakka","Torga",
    "Druuk","Krag","Mordak","Vrak","Thorga","Rugor","Grakka","Zogar","Brug","Droga",
    "Krug","Morgha","Vrosh","Thrak","Rogar","Ghor","Drorga","Krash","Mogru","Thruk",
    "Zrakka","Bror","Drosh","Gror","Krosh","Morug","Vrug","Throsh","Zorak","Brakka",
    "Drogar","Grush","Krorg","Morash","Vrash","Throg","Zrug","Brorg","Drokk","Grakk",
    "Krogg","Morog","Vrogg","Thokk","Zrorg","Brugg","Drogg","Grukk","Krog","Morogg",
    "Vrok","Throg","Zrog","Brorg","Drog","Grorg","Krogga","Morgha","Vrogga","Throga",
    "Zrogga","Bragga","Droga","Graga","Kraga","Moraga","Vraga","Thraga","Zraga",
    "Brakka","Droshk","Grashk","Krashk","Morashk","Vrashk","Thrashk","Zrashk","Brashk",
    "Drokk","Grok","Krok","Morok","Vrok","Throk","Zrok","Brokk","Drokk","Grokka"
  ],

  highElf: [
    "Aelar","Aeris","Aethen","Althir","Arannis","Arieth","Belanor","Caelir","Daeris",
    "Elarion","Faelar","Galion","Haerith","Ithilion","Jhaeros","Kaelir","Laerion",
    "Maelis","Naerion","Olorin","Paelias","Quarion","Raelis","Saelis","Taerion",
    "Ularis","Vaelis","Wynelis","Xaelis","Yraeth","Zaerion","Aerith","Belith","Caerith",
    "Daelith","Elarith","Faerith","Gaerith","Haelith","Iraelith","Jhaelith","Kaerith",
    "Laerith","Maerith","Naelith","Oraelith","Paelith","Qyraelith","Raelith","Saelith",
    "Taelith","Uraelith","Vaelith","Wynelith","Xaelith","Yraelith","Zaelith","Aelith",
    "Belion","Caelion","Daelion","Elarion","Faelion","Gaelion","Haelion","Iraelion",
    "Jhaelion","Kaelion","Laelion","Maelion","Naelion","Oraelion","Paelion","Qyraelion",
    "Raelion","Saelion","Taelion","Uraelion","Vaelion","Wynelion","Xaelion","Yraelion",
    "Zaelion","Aerin","Belin","Caelin","Daelin","Elarin","Faelin","Gaelin","Haelin",
    "Iraelin","Jhaelin","Kaelin","Laelin","Maelin"
  ],

  woodElf: [
    "Thalan","Sylra","Liora","Faelyn","Caelynn","Riven","Thalindra","Eryndor","Sylwen",
    "Aralith","Faelith","Lethra","Naelis","Orith","Rynel","Saelis","Tareth","Ulin",
    "Vaela","Wynra","Xilith","Yllara","Zaelis","Aerwyn","Belwyn","Caelwyn","Daelwyn",
    "Elarwyn","Faelwyn","Gaelwyn","Haelwyn","Iraelwyn","Jhaelwyn","Kaelwyn","Laelwyn",
    "Maelwyn","Naelwyn","Oraelwyn","Paelwyn","Qyraelwyn","Raelwyn","Saelwyn","Taelwyn",
    "Uraelwyn","Vaelwyn","Wynelwyn","Xaelwyn","Yraelwyn","Zaelwyn","Aeryn","Belyn",
    "Caelyn","Daelyn","Elarin","Faelyn","Gaelyn","Haelyn","Iraelyn","Jhaelyn","Kaelyn",
    "Laelyn","Maelyn","Naelyn","Oraelyn","Paelyn","Qyraelyn","Raelyn","Saelyn","Taelyn",
    "Uraelyn","Vaelyn","Wynelyn","Xaelyn","Yraelyn","Zaelyn","Aerisyl","Belsyl",
    "Caelsyl","Daelsyl","Elarsyl","Faelsyl","Gaelsyl","Haelsyl","Iraelsyl","Jhaelsyl",
    "Kaelsyl","Laelsyl","Maelsyl","Naelsyl","Oraelsyl","Paelsyl","Qyraelsyl","Raelsyl",
    "Saelsyl","Taelsyl"
  ],

  darkElf: [
    "Drizra","Zilvra","Malice","Velkyn","Xilrae","Zariel","Ilvara","Nalfein","Viconia",
    "Zilith","Ryld","Z'ress","Pharaun","Quenthel","Jarlax","Triel","Valsharess",
    "Zilrae","Ilmryn","Xullrae","Zesstra","Drisrae","Veldrin","Zilven","Myraeth",
    "Nalrae","Velkynra","Zinrae","Xilithra","Drisven","Malrae","Velra","Zinra",
    "Ilvra","Nalvra","Xilvra","Zesvra","Drasvra","Malvra","Velvra","Zinvra","Ilvryn",
    "Nalvryn","Xilvryn","Zesvryn","Drasvryn","Malvryn","Velvryn","Zinvryn","Ilvryn",
    "Nalryn","Xilryn","Zesryn","Drasryn","Malryn","Velryn","Zinryn","Ilryn","Nalryn",
    "Xilryn","Zesryn","Drasryn","Malryn","Velryn","Zinryn","Ilryn","Nalryn","Xilryn",
    "Zesryn","Drasryn","Malryn","Velryn","Zinryn","Ilryn","Nalryn","Xilryn","Zesryn",
    "Drasryn","Malryn","Velryn","Zinryn","Ilryn","Nalryn","Xilryn","Zesryn","Drasryn",
    "Malryn","Velryn","Zinryn","Ilryn","Nalryn","Xilryn","Zesryn","Drasryn","Malryn"
  ],

  hillDwarf: [
    "Borin","Dagna","Harbek","Morgran","Rurik","Tordek","Baern","Dain","Einkil",
    "Fargrim","Gimli","Harbin","Kazrik","Lodrin","Morin","Norin","Orsik","Rangrim",
    "Thorik","Ulfgar","Varin","Whurbin","Yorin","Zarn","Bofrin","Dorrin","Grimnar",
    "Hadrik","Kildrak","Logrin","Morak","Naldor","Orik","Rorik","Storn","Thrain",
    "Urik","Vondal","Worik","Zorik","Bargrim","Dorgrim","Grimbar","Hargrim","Kazgrim",
    "Logrim","Morgrim","Norgrim","Orgrim","Rorgrim","Storgrim","Thorgrim","Ulfgrim",
    "Vorgrim","Worgrim","Zorgrim","Barin","Dorin","Grin","Harin","Kazin","Lorin",
    "Morin","Norin","Orin","Rorin","Storin","Thorin","Urin","Vorin","Worin","Zorin",
    "Barak","Dorak","Grak","Harak","Kazak","Lorak","Morak","Norak","Orak","Rorak",
    "Storak","Thorak","Ulfak","Vorak","Worak","Zorak","Barek","Dorek","Grek","Harek"
  ],

  mountainDwarf: [
    "Adrik","Baern","Barendd","Brottor","Dain","Fargrim","Flint","Gardain","Harbek",
    "Kildrak","Morgran","Orsik","Rangrim","Taklinn","Thoradin","Tordek","Traubon",
    "Ulfgar","Veit","Vondal","Barak","Dorak","Grak","Harak","Kazak","Lorak","Morak",
    "Norak","Orak","Rorak","Storak","Thorak","Ulfak","Vorak","Worak","Zorak","Barek",
    "Dorek","Grek","Harek","Kazek","Lorek","Morek","Norek","Orek","Rorek","Storek",
    "Thorek","Ulfek","Vorek","Worek","Zorek","Barik","Dorik","Grik","Harik","Kazik",
    "Lorik","Morik","Norik","Orik","Rorik","Storik","Thorik","Ulfik","Vorik","Worik",
    "Zorik","Barun","Dorun","Grun","Harun","Kazun","Lorun","Morun","Norun","Orun",
    "Rorun","Storun","Thorun","Ulfrun","Vorun","Worun","Zorun","Baran","Doran","Gran",
    "Haran","Kazan","Loran","Moran","Noran","Oran","Roran","Storan","Thoran"
  ],

  duergar: [
    "Dror","Ghor","Khar","Mor","Thar","Zhar","Bhor","Dor","Kor","Lor",
    "Nor","Or","Ror","Sor","Tor","Vor","Wor","Xor","Yor","Zor",
    "Drorak","Ghorak","Kharak","Morak","Tharak","Zharak","Bhorak","Dorak","Korak","Lorak",
    "Norak","Orak","Rorak","Sorak","Torak","Vorak","Worak","Xorak","Yorak","Zorak",
    "Drorik","Ghorik","Kharik","Morik","Tharik","Zharik","Bhorik","Dorik","Korik","Lorik",
    "Norik","Orik","Rorik","Sorik","Torik","Vorik","Worik","Xorik","Yorik","Zorik",
    "Drorun","Ghorun","Kharun","Morun","Tharun","Zharun","Bhorun","Dorun","Korun","Lorun",
    "Norun","Orun","Rorun","Sorun","Torun","Vorun","Worun","Xorun","Yorun","Zorun",
    "Droran","Ghoran","Kharan","Moran","Tharan","Zharan","Bhoran","Doran","Koran","Loran",
    "Noran","Oran","Roran","Soran","Toran","Voran","Woran","Xoran","Yoran","Zoran"
  ],

  gnome: [
    "Boddynock","Dimble","Fonkin","Jebeddo","Namfoodle","Roondar","Seebo","Warryn",
    "Zook","Bimble","Tink","Fizz","Pip","Wizzle","Nim","Bop","Zib","Tock","Wob","Fenn",
    "Nib","Poggle","Riff","Tazz","Bizzle","Dabble","Fizzle","Glim","Hobble","Jibble",
    "Kibble","Libble","Mibble","Nibble","Pibble","Quibble","Ribble","Sibble","Tibble",
    "Vibble","Wibble","Xibble","Yibble","Zibble","Boddle","Doddle","Foddle","Goddle",
    "Hoddle","Joddle","Koddle","Loddle","Moddle","Noddle","Poddle","Qoddle","Roddle",
    "Soddle","Toddle","Voddle","Woddle","Xoddle","Yoddle","Zoddle","Bimkin","Dimkin",
    "Fimkin","Gimkin","Himkin","Jimkin","Kimkin","Limkin","Mimkin","Nimkin","Pimkin",
    "Qimkin","Rimkin","Simkin","Timkin","Vimkin","Wimkin","Ximkin","Yimkin","Zimkin",
    "Fizzkin","Tinkkin","Pipkin","Zookkin","Warrynkin","Seebokin","Roondarkin"
  ],

  halfling: [
    "Alton","Andry","Cade","Corrin","Eldon","Errich","Finnan","Garret","Lindal",
    "Lyle","Milo","Osborn","Perrin","Reed","Roscoe","Wellby","Tobin","Finnan",
    "Bram","Cory","Dill","Eli","Falk","Gus","Hob","Ira","Jory","Kip","Lark","Merry",
    "Ned","Odo","Pip","Quin","Rollo","Sam","Tuck","Udo","Vim","Wes","Yim","Zeb",
    "Bramble","Clover","Daisy","Fennel","Hazel","Ivy","Juniper","Laurel","Mallow",
    "Nettle","Poppy","Rose","Sage","Thyme","Willow","Yarrow","Beryl","Cora","Dora",
    "Etta","Fara","Gwen","Hilda","Iris","Jessa","Kira","Lena","Mira","Nora","Ona",
    "Pella","Quilla","Risa","Sela","Tessa","Una","Vera","Willa","Xena","Yara","Zella",
    "Arlo","Benji","Cobb","Dobb","Ebb","Fobb","Gobb","Hobb","Jebb","Kobb"
  ],

  tiefling: [
    "Akmenos","Amnon","Barakas","Damakos","Ekemon","Iados","Kairon","Leucis",
    "Melech","Mordai","Morthos","Pelaios","Skamos","Therai","Zeth","Azrael",
    "Belial","Caim","Dagon","Erebus","Furcas","Gorgon","Hades","Iblis","Jezreth",
    "Kaziel","Lucien","Malphas","Nerith","Orias","Paimon","Quorin","Raze","Severin",
    "Thamiel","Uriax","Valac","Wex","Xaphan","Yeqon","Zagan","Azar","Baal","Cinder",
    "Dusk","Ember","Flint","Gloom","Hex","Infer","Jinx","Knell","Lash","Malice",
    "Nox","Onyx","Pyre","Quill","Ruin","Sable","Thorn","Umber","Vex","Wraith",
    "Xyre","Yrex","Zyre","Ash","Blaze","Coal","Drake","Ember","Fume","Grave",
    "Hellion","Ignis","Jareth","Karn","Lucius","Morv","Nerez","Orvyn","Phex",
    "Quorra","Rex","Syrex","Tyrex","Urex","Vyre","Wyrex","Xyrex","Yrex","Zyrex"
  ],

  dragonborn: [
    "Arjhan","Balasar","Bharash","Donaar","Ghesh","Heskan","Kriv","Medrash","Nadarr",
    "Pandjed","Patrin","Rhogar","Shamash","Shedinn","Tarhun","Torinn","Arrax",
    "Belrax","Crax","Drax","Errax","Frax","Grax","Hrax","Irax","Jrax","Krax","Lrax",
    "Mrax","Nrax","Orax","Prax","Qrax","Rrax","Srax","Trax","Urax","Vrax","Wrax",
    "Xrax","Yrax","Zrax","Arvok","Belvok","Cravok","Dravok","Ervok","Fravok","Gravok",
    "Hravok","Iravok","Jravok","Kravok","Lravok","Mravok","Nravok","Oravok","Pravok",
    "Qravok","Rravok","Sravok","Travok","Uravok","Vravok","Wravok","Xravok","Yravok",
    "Zravok","Arthor","Belthor","Crathor","Drathor","Erthor","Frathor","Grathor",
    "Hrathor","Irathor","Jrathor","Krathor","Lrathor","Mrathor","Nrathor","Orathor",
    "Prathor","Qrathor","Rrathor","Srathor","Trathor","Urathor","Vrathor","Wrathor"
  ],

  humanoid: [
    "Grub","Snarg","Krikk","Zruk","Brakka","Drizz","Sniv","Grakk","Thruk",
    "Zarn","Brog","Drak","Gnar","Kruk","Murg","Snor","Thrag","Vrok","Wrag",
    "Yrug","Zrug","Brogga","Dragga","Gragga","Krugga","Morgga","Snagga",
    "Thragga","Vrugga","Wrugga","Zrugga","Brikk","Drikk","Grikk","Krikk",
    "Morrk","Snikk","Thrikk","Vrikk","Wrikk","Zrikk","Bork","Dork","Gork",
    "Kork","Mork","Snork","Thork","Vork","Work","Zork","Barg","Darg","Garg",
    "Karg","Marg","Snarg","Tharg","Varg","Warg","Zarg","Brek","Drek","Grek",
    "Krek","Mrek","Snrek","Threk","Vrek","Wrek","Zrek","Brax","Drax","Grax",
    "Krax","Mrax","Snrax","Thrax","Vrax","Wrax","Zrax","Brug","Drug","Grug",
    "Krug","Mrug","Snrug","Thrug","Vrug","Wrug","Zrug"
  ],

  giant: [
    "Brondar","Grath","Thrum","Kordran","Morgath","Drogor","Valdrum","Skarn",
    "Torvok","Gorath","Brakka","Haldor","Grumvar","Tharok","Drondar","Varkor",
    "Kragor","Hrodin","Braldor","Vormag","Skorun","Thuldar","Brumgar","Dorvak",
    "Garnor","Hrogar","Karnath","Lodrak","Morvag","Norvak","Orgrim","Rundar",
    "Skoldar","Thorgar","Ulgar","Vargor","Wuldar","Yorvak","Zarnok","Bruthar",
    "Drakar","Gorthal","Hragor","Karvok","Muldar","Norgrim","Orvak","Ruldar",
    "Skorvak","Thargrim","Ulthar","Vargrim","Wrogar","Yuldar","Zorgrim","Bravok",
    "Dorgrim","Gorvak","Haldgrim","Karnor","Lodgrim","Morgrim","Norvak","Ordar",
    "Rogrim","Skavok","Thuldor","Ulgrim","Varvak","Wrogrim","Yorgrim","Zarnor",
    "Bralgrim","Draldor","Gorthar","Hrogrim","Kragor","Lornak","Mordar","Norvak",
    "Orvak","Ruldor","Skarnor","Thorgor","Ulvak","Varvak","Wornak","Yornak",
    "Zornak","Bragnar","Drognar","Gornak","Harnak"
  ],

  dragon: [
    "Azryth","Baltherion","Cyranth","Drakorith","Eryndor","Faerithrax","Galdryx",
    "Hazaroth","Iryndrax","Jhazor","Kalthryx","Lathorion","Myzryth","Nythor",
    "Ordrath","Pyraxis","Qyranth","Rhazoryx","Syldryx","Tharaxion","Urzryth",
    "Vaelithrax","Wyranth","Xarzyx","Ythryndor","Zarathrix","Aldryx","Beryndrax",
    "Caelthar","Draxion","Eldryth","Fyranth","Gorathrix","Helzyr","Irathrix",
    "Jorathion","Kyranth","Lythrax","Morzyr","Nyraxion","Oryndrax","Pyranth",
    "Qorathrix","Ryndrax","Sythor","Thalzyr","Uldryx","Vyranth","Worathrix",
    "Xyranth","Yorathrix","Zyldryx","Arathrix","Balthryx","Cyndrax","Drathor",
    "Eryndrax","Faerzyr","Gryndrax","Halthor","Izyrath","Jyranth","Kalthor",
    "Lorathrix","Mythor","Nyranth","Orathrix","Pyrorath","Qyrorath","Rorathrix",
    "Sorathrix","Torathrix","Urorathrix","Vorathrix","Worathrix","Xorathrix",
    "Yorathrix","Zorathrix","Azorath","Brazorath","Crazorath","Drazorath",
    "Erazorath","Frazorath","Grazorath","Hrazorath","Irazorath","Jrazorath",
    "Krazorath","Lrazorath","Mrazorath","Nrazorath"
  ],

  monstrosity: [
    "Arvak","Briznar","Corthak","Dravik","Erlok","Fyrnak","Gorth","Havrak",
    "Izmar","Jorvak","Krith","Lornak","Myrnak","Norzul","Orvak","Pyrnak",
    "Qorvak","Ryzmar","Sornak","Thryz","Urvak","Vornak","Wyrnak","Xorvak",
    "Yrzmar","Zornak","Arzvak","Brornak","Cyrvak","Drornak","Erzvak","Frornak",
    "Grornak","Hrornak","Irornak","Jrornak","Krornak","Lrornak","Mrornak",
    "Nrornak","Orornak","Prornak","Qrornak","Rrornak","Srornak","Trornak",
    "Urornak","Vrornak","Wrornak","Xrornak","Yrornak","Zrornak","Arazmar",
    "Brazmar","Crazmar","Drazmar","Erazmar","Frazmar","Grazmar","Hrazmar",
    "Irazmar","Jrazmar","Krazmar","Lrazmar","Mrazmar","Nrazmar","Orazmar",
    "Prazmar","Qrazmar","Rrazmar","Srazmar","Trazmar","Urazmar","Vrazmar",
    "Wrazmar","Xrazmar","Yrazmar","Zrazmar","Akrath","Bkrath","Ckrath",
    "Dkrath","Ekrath","Fkrath","Gkrath","Hkrath","Ikrath","Jkrath","Kkrath",
    "Lkrath","Mkrath","Nkrath"
  ],

  celestial: [
    "Aurelion","Seraphel","Lumiel","Vaerion","Elyndra","Caelith","Thaliel",
    "Azariel","Myriel","Oriphiel","Zeraphiel","Aethriel","Beliel","Cyraliel",
    "Daeriel","Elariel","Faeriel","Gaeriel","Haeliel","Iraeliel","Jhaeliel",
    "Kaeliel","Laeliel","Maeliel","Naeliel","Oraeliel","Paeliel","Qyraeliel",
    "Raeliel","Saeliel","Taeliel","Uraeliel","Vaeliel","Wyneliel","Xaeliel",
    "Yraeliel","Zaeliel","Auriel","Bariel","Cyrion","Darael","Eroniel",
    "Faerion","Garael","Harael","Ithrael","Jorael","Karael","Lorael","Morael",
    "Norael","Oraeon","Porael","Qorael","Rorael","Sorael","Torael","Uraon",
    "Vorael","Worael","Xorael","Yorael","Zorael","Aetherion","Beltherion",
    "Cyrtherion","Daertherion","Elartherion","Faertherion","Gaertherion",
    "Haeltherion","Iraeltherion","Jhaeltherion","Kaeltherion","Laeltherion",
    "Maeltherion","Naeltherion","Oraeltherion","Paeltherion","Qyraeltherion",
    "Raeltherion","Saeltherion","Taeltherion","Uraeltherion","Vaeltherion"
  ],

  construct: [
    "Axiom","Unit-7","Cogran","Steelix","Brontek","Gearis","Automar","Ferron",
    "Mechros","Bronzar","Cogmind","Ironel","Gearion","Mechar","Bronthus",
    "Cogthor","Ironthor","Gearvak","Mechvak","Bronvak","Cogvak","Ironvak",
    "Automon","Ferrum","Gearum","Mechum","Cogum","Ironum","Bronum","Axiomar",
    "Ferronar","Gearonar","Mecharon","Cogaron","Ironaron","Bronaron","Axiovak",
    "Ferravak","Unit-9","Unit-11","Unit-13","Unit-17","Unit-19","Unit-23",
    "Unit-29","Unit-31","Unit-37","Unit-41","Unit-43","Unit-47","Unit-53",
    "Unit-59","Unit-61","Unit-67","Unit-71","Unit-73","Unit-79","Unit-83",
    "Unit-89","Unit-97","Prime-1","Prime-2","Prime-3","Prime-4","Prime-5",
    "Prime-6","Prime-7","Prime-8","Prime-9","Prime-10"
  ],

  elemental: [
    "Pyrax","Ignivar","Emberon","Cindros","Ashmar","Flarex","Blazion","Scorvak",
    "Fyrion","Searvak","Aqualis","Tidalor","Marinus","Brinor","Delphar",
    "Nerion","Thalor","Coralix","Waveon","Nautar","Tempestus","Stormar",
    "Zephyron","Gustor","Aeron","Whirlis","Skyran","Borealix","Cyclonar",
    "Thunderis","Terranox","Granith","Stonear","Bouldar","Cragor","Bedrox",
    "Roknar","Dustor","Quakar","Shardis","Magmar","Lavion","Cindar","Volkris",
    "Pyronis","Fyrvak","Ignisar","Flamar","Ashvak","Embervak","Stormvak",
    "Wavevak","Stonevak","Dustvak","Sparkis","Galeis","Torrentis","Cragis",
    "Emberis","Flareis","Frostis","Glaciar","Icethar","Snowvak","Hailor",
    "Fyrmar","Lavvak","Volmar","Ashor","Coalor","Pyroth","Flamoth","Sparkoth",
    "Gustoth","Stormoth","Waveoth","Stoneoth","Dustoth","Emberoth","Flareoth",
    "Iceoth","Snowoth","Frostoth","Magmoth","Lavmoth","Volmoth","Quakoth",
    "Shardoth","Cragoth","Torrentoth","Cycloth"
  ],

  fey: [
    "Liriel","Thistle","Bramble","Petal","Dewdrop","Willowshade","Moonpetal",
    "Glimmer","Puck","Larkspur","Faelith","Sylvara","Nimble","Pipkin","Tansy",
    "Bluebell","Clover","Honeyblossom","Dandelion","Fernwhisper","Briar",
    "Foxglove","Hazelshade","Juniper","Lilac","Mosswillow","Nettle","Oakshade",
    "Poppy","Rosewhisper","Sageleaf","Thornpetal","Umberfern","Violetshade",
    "Wisteria","Yarrow","Zinnia","Petalfall","Brambletoe","Glowcap","Mirth",
    "Fiddlefern","Leafdance","Moonfern","Starpetal","Sunpetal","Dreamroot",
    "Silverfern","Goldpetal","Glowroot","Shimmer","Feythorn","Moonbriar",
    "Starlace","Glowpetal","Brightfern","Mistpetal","Lilybloom","Shadefern",
    "Gossamer","Dewfern","Petalshade","Glowwillow","Bloomshade","Silverleaf",
    "Goldleaf","Amberfern","Mistwillow","Petalwhisper","Fernwhisper","Moonshade",
    "Starshade","Bloompetal","Glowfern","Briarpetal","Petalfern","Thornfern",
    "Moonlace","Sunlace","Mistlace","Starfern","Bloomlace","Glowlace"
  ],

  fiend: [
    "Azgorth","Belrax","Cythor","Drazgul","Erixor","Falgor","Grazhul","Harkul",
    "Izrak","Jezrath","Kazhul","Lorthak","Mazgor","Nerax","Ozgor","Pazrak",
    "Qazhul","Ravzul","Sargoth","Thrazkul","Uzgor","Varkul","Wazgul","Xezrak",
    "Yargoth","Zarzul","Azraz","Belraz","Cyrraz","Drazraz","Erzraz","Frzraz",
    "Grzraz","Hrzraz","Irzraz","Jrzraz","Krzraz","Lrzraz","Mrzraz","Nrzraz",
    "Orzraz","Przraz","Qrzraz","Rrzraz","Srzraz","Trzraz","Urzraz","Vrzraz",
    "Wrzraz","Xrzraz","Yrzraz","Zrzraz","Azkath","Belkath","Cyrkath","Drakath",
    "Erkath","Frakath","Grakath","Hrakath","Irakath","Jrakath","Krakath",
    "Lrakath","Mrakath","Nrakath","Orakath","Prakath","Qrakath","Rrakath",
    "Srakhath","Trakath","Urakath","Vrakath","Wrakath","Xrakath","Yrakath",
    "Zrakath","Azthar","Belthar","Cyrthar","Drathar","Erthar","Frathar",
    "Grathar","Hrathar","Irathar","Jrathar","Krathar","Lrathar"
  ],

  undead: [
    "Morvain","Dreador","Skulvar","Grimlor","Necros","Thornak","Vorlis",
    "Xeroth","Yorvain","Zeroth","Bonevak","Ghastor","Gravemir","Doomvak",
    "Cryptor","Vilethorn","Shadevak","Hollowmir","Skorn","Ruinor","Morbain",
    "Duskvar","Ashvain","Grimvain","Skelvar","Harrowvak","Nocthar","Dreadvak",
    "Cryptvain","Bonevain","Ghoulvain","Skornvak","Vilevak","Shadevain",
    "Dreador","Cryptor","Gravethor","Ashthor","Boneor","Ghastthor","Grimthor",
    "Nocthor","Shadeor","Skullthor","Wraithor","Phantomor","Specthar","Soulor",
    "Deathor","Dreador","Grimor","Ashor","Boneor","Ghastor","Graveor","Cryptor",
    "Wraithor","Shadeor","Soulor","Spiritor","Phantomor","Spector","Dreadmir",
    "Grimmir","Ashmir","Bonemir","Ghastmir","Gravemir","Cryptmir","Wraithmir",
    "Shademir","Soulmir","Spiritmir","Phantommir","Spectmir","Dreadvak",
    "Grimvak","Ashvak","Bonevak","Ghastvak","Gravevak","Cryptvak","Wraithvak",
    "Shadevak","Soulvak","Spiritvak"
  ],

  default: ["Stranger", "Wanderer", "Unnamed"]
};

// ---------------------------------------------------------------------------
// Appearance bank — flat array, applies to all species/creature types.
// Populated in Phase M5.
// ---------------------------------------------------------------------------

const MERCHANT_APPEARANCES = [
  "wooden leg",
  "eyepatch",
  "missing teeth",
  "facial scar",
  "slackjawed",
  "milky-white eyes",
  "poor posture",
  "eerily beautiful",
  "colorful hair",
  "colorful tattoos",
  "piercings",
  "tall and lanky",
  "short and squat",
  "brawny",
  "malnourished",
  "bulging eyes",
  "oversized glasses",
  "garish makeup",
  "ragged clothes",
  "flamboyant",
  "crooked nose",
  "broken nose",
  "one cauliflower ear",
  "burn scars",
  "pockmarked skin",
  "sun-weathered skin",
  "freckled face",
  "rosy cheeks",
  "hollow cheeks",
  "lantern jaw",
  "square jaw",
  "hooked nose",
  "long braided beard",
  "patchy beard",
  "carefully waxed mustache",
  "wild untamed hair",
  "shaved head",
  "oiled hair",
  "greasy hair",
  "matted hair",
  "silver-streaked hair",
  "prematurely gray",
  "braided hair with beads",
  "feathered hair ornaments",
  "fanglike teeth",
  "gold tooth",
  "blackened teeth",
  "sharp cheekbones",
  "heavy brow",
  "thick eyebrows",
  "missing eyebrow",
  "tattooed scalp",
  "ritual scarification",
  "sunken eyes",
  "bright green eyes",
  "unsettling amber eyes",
  "mismatched eyes",
  "bloodshot eyes",
  "sleep-deprived eyes",
  "dark circles under the eyes",
  "constant squint",
  "perpetual smirk",
  "toothless grin",
  "thin-lipped",
  "chapped lips",
  "paint-stained hands",
  "ink-stained fingers",
  "burned fingertips",
  "calloused hands",
  "scarred knuckles",
  "missing fingers",
  "extra finger on one hand",
  "trembling hands",
  "thick ropey veins",
  "hairy arms",
  "broad shoulders",
  "barrel-chested",
  "stooped shoulders",
  "one shoulder higher than the other",
  "long-necked",
  "pot belly",
  "thick waist",
  "thin as a rail",
  "knock-kneed",
  "bow-legged",
  "limps slightly",
  "walks with a cane",
  "heavy boots",
  "barefoot",
  "mud-caked hems",
  "fine embroidered robes",
  "patched cloak",
  "moth-eaten cloak",
  "fur-lined mantle",
  "too much jewelry",
  "heavy signet rings",
  "bone jewelry",
  "jade jewelry",
  "copper bangles",
  "perfumed",
  "smells faintly of incense",
  "smells of smoke",
  "smells of the sea",
  "smells of horses",
  "smells of alchemy reagents",
  "always damp",
  "dust-covered",
  "immaculately groomed",
  "battle-worn",
  "travel-stained",
  "mud-splattered",
  "bloodstained apron",
  "velvet gloves",
  "silk gloves",
  "lace collar",
  "high-collared coat",
  "hood shadowing the face",
  "masked lower face",
  "hooded eyes",
  "deep laugh lines",
  "wrinkled face",
  "ageless face",
  "childlike face",
  "stern expression",
  "soft expression",
  "perpetually suspicious look",
  "wide unsettling grin",
  "nervous twitch",
  "constantly fidgeting",
  "drumming fingers",
  "clenched jaw",
  "always chewing something",
  "voice-cracked and rough-looking",
  "elegant posture",
  "moves with feline grace",
  "moves stiffly",
  "moves like a predator",
  "covered in holy symbols",
  "covered in soot",
  "wears too many belts",
  "wears dangling charms",
  "wears trophies from beasts",
  "wears polished armor pieces as fashion",
  "cloak pinned with a strange brooch",
  "face hidden behind a veil",
  "nose ring with chain",
  "elaborate ear cuffs",
  "crystal embedded in the skin",
  "glittering scales along the neck",
  "faintly glowing eyes",
  "faintly glowing tattoos",
  "ashen skin",
  "bronze skin",
  "blue-tinted skin",
  "green-tinted skin",
  "albino",
  "unnaturally pale",
  "ruddy complexion",
  "weather-cracked lips",
  "scar across the throat",
  "burned-off beard",
  "braided mustache charms",
  "beads woven into the beard",
  "bejeweled eyepatch",
  "fine noble clothing gone shabby",
  "perfect teeth except for one gold fang",
  "towering height",
  "surprisingly tiny",
  "thick neck",
  "bent spine",
  "crooked smile",
  "missing one ear",
  "notched ears",
  "tattooed face",
  "painted face",
  "ashen makeup",
  "glitter dusted on the cheeks",
  "elaborate hairstyle",
  "wild sideburns",
  "braided sideburns",
  "scarred lips",
  "split lip",
  "burn mark over one eye",
  "one eye always watering",
  "reddened nose",
  "unshakable sneer",
  "gilded prosthetic hand",
  "iron brace on one leg",
  "bandaged hands",
  "bandaged neck",
  "scarred scalp",
  "brand mark on the forearm",
  "ritual paint across the eyes",
  "cloak made from patchwork fabrics",
  "threadbare noble coat",
  "too-clean boots",
  "faded finery",
  "gleaming smile",
  "wolfish grin",
  "hawk-like stare",
  "soft doe eyes",
  "gaunt face",
  "double chin",
  "scarred arms",
  "thickly muscled forearms",
  "delicate hands",
  "nails bitten to the quick",
  "long lacquered nails",
  "gold dust in the hair",
  "flowers braided into the hair",
  "bones braided into the hair",
  "charms sewn into the clothes"
];

// ---------------------------------------------------------------------------
// Quirk bank — flat array. Populated in Phase M6.
// ---------------------------------------------------------------------------

const MERCHANT_QUIRKS = [
  "Hums while counting coin",
  "Refuses to shake hands",
  "Keeps a lucky charm visible at all times",
  "Never makes eye contact",
  "Speaks in a conspiratorial whisper",
  "Constantly fidgets with something on the counter"
];

// ---------------------------------------------------------------------------
// Background table — 1d20
// ---------------------------------------------------------------------------

const MERCHANT_BACKGROUNDS = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin",
  "Far Traveler",
  "Haunted One",
  "Knight",
  "Pirate",
  "City Watch",
  "Clan Crafter",
  "Courtier"
];

// ---------------------------------------------------------------------------
// Personality table — 1d20
// ---------------------------------------------------------------------------

const MERCHANT_PERSONALITIES = [
  "Boastful",
  "Cautious",
  "Cheerful",
  "Cowardly",
  "Curious",
  "Cynical",
  "Flirtatious",
  "Generous",
  "Gruff",
  "Honest",
  "Inquisitive",
  "Lazy",
  "Meticulous",
  "Mysterious",
  "Nervous",
  "Paranoid",
  "Sarcastic",
  "Secretive",
  "Superstitious",
  "Talkative"
];

// ---------------------------------------------------------------------------
// Bias tables — 1d20 each (positive and negative)
// ---------------------------------------------------------------------------

const MERCHANT_BIASES = [
  "The poor",
  "The rich",
  "Adventurers",
  "The clergy",
  "Soldiers",
  "Magic users",
  "Elves",
  "Dwarves",
  "Halflings",
  "Tieflings",
  "Half-orcs",
  "Gnomes",
  "Merchants",
  "Nobles",
  "Outlanders",
  "Scholars",
  "Sailors",
  "Thieves",
  "The City Guard",
  "Travelers"
];

// ---------------------------------------------------------------------------
// Species / Creature tables
// ---------------------------------------------------------------------------

const CREATURE_TYPES = {
  // 1: Humanoid
  humanoid: {
    subroll: {
      1: "Bugbear",
      2: "Gnoll",
      3: "Goblin",
      4: "Hobgoblin",
      5: "Kobold",
      6: "Lizardfolk",
      7: "Merfolk",
      8: "Orc"
    }
  },
  // 2: Giant
  giant: {
    subroll: {
      1: "Cloud Giant",
      2: "Storm Giant",
      3: "Cyclops",
      4: "Ettin",
      5: "Fire Giant",
      6: "Frost Giant",
      7: "Hill Giant",
      8: "Stone Giant"
    }
  },
  // 3: Dragon — same 10 colors as Dragonborn
  dragon: {
    subroll: {
      1:  "Black Dragon",
      2:  "Blue Dragon",
      3:  "Brass Dragon",
      4:  "Bronze Dragon",
      5:  "Copper Dragon",
      6:  "Gold Dragon",
      7:  "Green Dragon",
      8:  "Red Dragon",
      9:  "Silver Dragon",
      10: "White Dragon"
    }
  },
  // 4: Monstrosity
  monstrosity: {
    subroll: {
      1: "Centaur",
      2: "Drider",
      3: "Ettercap",
      4: "Medusa",
      5: "Minotaur",
      6: "Sphinx"
    }
  },
  // 5: Celestial
  celestial: {
    subroll: {
      1: "Couatl",
      2: "Deva",
      3: "Planetar",
      4: "Unicorn"
    }
  },
  // 6: Construct
  construct: {
    subroll: {
      1: "Clay Golem",
      2: "Flesh Golem",
      3: "Iron Golem",
      4: "Stone Golem"
    }
  },
  // 7: Elemental
  elemental: {
    subroll: {
      1: "Azer",
      2: "Djinni",
      3: "Efreeti",
      4: "Gargoyle"
    }
  },
  // 8: Fey
  fey: {
    subroll: {
      1: "Dryad",
      2: "Hag",
      3: "Pixie",
      4: "Satyr"
    }
  },
  // 9: Fiend
  fiend: {
    subroll: {
      1: "Balor",
      2: "Imp",
      3: "Pit Fiend",
      4: "Quasit",
      5: "Rakshasa",
      6: "Succubus"
    }
  },
  // 10: Undead
  undead: {
    subroll: {
      1: "Banshee",
      2: "Ghast",
      3: "Ghost",
      4: "Lich",
      5: "Mummy",
      6: "Vampire"
    }
  }
};