import { of as observableOf, Observable } from "rxjs";

import { debounceTime } from "rxjs/operators";
import { Injectable } from "@angular/core";

import { lemmas } from "./avaliable_lemmas_temp";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class HttpService {
  // apiBase = 'http://156.17.135.29:8888/wordnetloom-server/resources/';

  apiBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get(uri, base?: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Accept-Language": "en",
      }),
    };

    if (!base) {
      base = this.apiBase;
    }

    return this.http.get(base + uri, httpOptions);
    // .finally(() => {}); // possibly add cache here?
  }

  getAbsolute(uri) {
    return this.get("", uri);
  }

  getDictionaryItem(itemName, itemId) {
    return this.get("dictionaries/" + itemName + "/" + (itemId ? itemId : ""));
  }

  getSenseDetails(id) {
    return this.get("senses/" + id);
  }

  getSearchOptions(form: String, page = 0, perPage = 50) {
    let searchStr = "senses/search?lexicon=4&domain=55&";
    for (const key in form) {
      if (form[key] !== "" && form[key] !== undefined) {
        searchStr += key + "=" + form[key] + "&";
      }
    }
    return this.get(
      searchStr + "limit=" + perPage + "&start=" + page * perPage
    );
  }

  getGlobalOptions(searchedKey) {
    return this.get(searchedKey);
  }

  getSenseRelations(senseId) {
    return this.get("senses/" + senseId + "/relations");
  }

  getSearchAutocomplete(term) {
    const getLemmas = (searchedTerm, maxItemsToFind) => {
      const found = [];
      let somethingFound = false; // using this to optimize search function since lemmas are sorted,

      // true if searched term is yiddish
      const yiddishTerm = searchedTerm.search(/[\u0590-\u05FF]/) >= 0;

      if (yiddishTerm) {
        for (let i = 0; i < lemmas["yiddish"].length; i++) {
          if (lemmas["yiddish"][i].startsWith(searchedTerm.toLowerCase())) {
            found.push({ lemma: lemmas["yiddish"][i], spelling: "Yiddish" });
            somethingFound = true;
            if (found.length >= maxItemsToFind) {
              // check if list ready
              return found;
            }
          }
        }
      } else {
        // search if not yiddishTerm

        for (let i = 0; i < lemmas["latinAndYivo"].length; i++) {
          if (
            lemmas["latinAndYivo"][i][0].startsWith(searchedTerm.toLowerCase())
          ) {
            found.push({
              lemma: lemmas["latinAndYivo"][i][0],
              spelling:
                lemmas["latinAndYivo"][i][1] === "y" ? "Yivo" : "Philological",
            });
            somethingFound = true;
            if (found.length >= maxItemsToFind) {
              // check if list ready
              return found;
            }
          } else if (somethingFound) {
            return found;
          }
        }
      }
      return found;
    };
    return observableOf(getLemmas(term, 10)).pipe(debounceTime(750));
  }
  getLang(lang) {
    const langPath = `assets/i18n/${lang || "en"}.json`;
    return this.getAbsolute(langPath);
  }

  getYiddishDetails(senseId) {
    return this.get("senses/" + senseId + "/yiddish");
  }
}
