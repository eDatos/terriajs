import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import LocationSearchProviderTraits, {
  SearchProviderMapCenterTraits
} from "./LocationSearchProviderTraits";

export default class PeliasSearchProviderTraits extends mixTraits(
  LocationSearchProviderTraits,
  SearchProviderMapCenterTraits
) {
  url: string = "https://api.cesium.com/v1/geocode/search";

  @primitiveTrait({
    type: "string",
    name: "Key",
    description:
      "The EDATOS Terria api key."
  })
  key?: string;
}
