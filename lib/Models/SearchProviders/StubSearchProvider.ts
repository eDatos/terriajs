import SearchProviderMixin from "../../ModelMixins/SearchProviders/SearchProviderMixin";
import primitiveTrait from "../../Traits/Decorators/primitiveTrait";
import LocationSearchProviderTraits from "../../Traits/SearchProviders/LocationSearchProviderTraits";
import CreateModel from "../Definition/CreateModel";
import SearchProviderResults from "./SearchProviderResults";

export class StubSearchProviderTraits extends LocationSearchProviderTraits {
  @primitiveTrait({
    type: "boolean",
    name: "Is experiencing issues",
    description:
      "Whether the search provider is experiencing issues which may cause search results to be unavailable"
  })
  isExperiencingIssues: boolean = true;
}

export default class StubSearchProvider extends SearchProviderMixin(
  CreateModel(StubSearchProviderTraits)
) {
  static readonly type = "stub-search-provider";
  get type(): string {
    return StubSearchProvider.type;
  }

  protected logEvent(searchText: string) {
    return;
  }

  protected doSearch(
    searchText: string,
    results: SearchProviderResults
  ): Promise<void> {
    return Promise.resolve();
  }
}
