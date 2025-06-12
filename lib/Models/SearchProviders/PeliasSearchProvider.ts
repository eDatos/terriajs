import i18next from "i18next";
import { makeObservable, override, runInAction } from "mobx";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";

import {
  Category,
  SearchAction
} from "../../Core/AnalyticEvents/analyticEvents";
import loadJson from "../../Core/loadJson";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import LocationSearchProviderMixin from "../../ModelMixins/SearchProviders/LocationSearchProviderMixin";
import PeliasSearchProviderTraits from "../../Traits/SearchProviders/PeliasSearchProviderTraits";
import CreateModel from "../Definition/CreateModel";
import Terria from "../Terria";
import SearchProviderResults from "./SearchProviderResults";
import SearchResult from "./SearchResult";
import CommonStrata from "../Definition/CommonStrata";

interface PeliasGeocodeResultFeature {
  bbox: [number, number, number, number];
  geometry: { coordinates: [ number, number ] };
  properties: { label: string };
}

interface PeliasGeocodeResult {
  features: PeliasGeocodeResultFeature[];
}

export default class PeliasSearchProvider extends LocationSearchProviderMixin(
  CreateModel(PeliasSearchProviderTraits)
) {
  static readonly type = "pelias-search-provider";

  get type() {
    return PeliasSearchProvider.type;
  }

  constructor(uniqueId: string | undefined, terria: Terria) {
    super(uniqueId, terria);

    makeObservable(this);
  }

  @override
  override showWarning() {
    if (!this.key || this.key === "") {
      console.warn(
        `The ${applyTranslationIfExists(this.name, i18next)}(${
          this.type
        }) geocoder will always return no results because a CesiumIon key has not been provided. Please get a CesiumIon key from ion.cesium.com, ensure it has geocoding permission and add it to searchProvider.key or parameters.cesiumIonAccessToken in config.json.`
      );
    }
  }

  protected logEvent(searchText: string): void {
    this.terria.analytics?.logEvent(
      Category.search,
      SearchAction.cesium,
      searchText
    );
  }

  protected async doSearch(
    searchText: string,
    searchResults: SearchProviderResults
  ): Promise<void> {
    searchResults.results.length = 0;
    searchResults.message = undefined;

    let response: PeliasGeocodeResult;
    try {
      response = await loadJson<PeliasGeocodeResult>(
        `${this.url}?text=${searchText}&layers=address`
      );
    } catch (_e) {
      searchResults.message = {
        content: "translate#viewModels.searchErrorOccurred"
      };
      return;
    }

    runInAction(() => {
      if (!response.features || response.features.length === 0) {
        searchResults.message = {
          content: "translate#viewModels.searchNoLocations"
        };
        return;
      }

      searchResults.results = response.features.map<SearchResult>((feature) => {
       
        let [longitude, latitude] = feature.geometry.coordinates;
        const MARGIN = 0.001;
        const [w, s, e, n] = feature.bbox ? feature.bbox : [longitude - MARGIN, latitude - MARGIN, longitude + MARGIN, latitude + MARGIN];
        [longitude, latitude] = feature.geometry.coordinates ? feature.geometry.coordinates : [(s + n) / 2, (e + w) / 2];
        const rectangle = Rectangle.fromDegrees(w, s, e, n);

        return new SearchResult({
          name: feature.properties.label,
          clickAction: createZoomToFunction(this, rectangle),
          location: {
            latitude: latitude,
            longitude: longitude
          }
        });
      });
    });
  }
}

function createZoomToFunction(
  model: PeliasSearchProvider,
  rectangle: Rectangle
) {
  return function () {
    const terria = model.terria;
    terria.currentViewer.zoomTo(rectangle, model.flightDurationSeconds);
  };
}
