import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import Terria from "../../../lib/Models/Terria";
import ViewState from "../../../lib/ReactViewModels/ViewState";
import BottomDock from "../../../lib/ReactViews/BottomDock/BottomDock";

describe("BottomDock", function () {
  let terria: Terria;
  let viewState: ViewState;
  let testRenderer: ReactTestRenderer;

  beforeEach(function () {
    terria = new Terria({
      baseUrl: "./"
    });
    viewState = new ViewState({
      terria: terria,
      catalogSearchProvider: undefined,
      locationSearchProviders: []
    });
  });

  it("must create TJS-BottomDockFirstPortal", function () {
    act(() => {
      testRenderer = create(
        // @ts-ignore - because measureElement is untyped
        <BottomDock terria={terria} viewState={viewState} />
      );
    });
    const firstPortal = testRenderer.root.findByProps({
      id: "TJS-BottomDockFirstPortal"
    });
    expect(firstPortal).toBeDefined();
  });

  it("must create TJS-BottomDockLastPortal", function () {
    act(() => {
      testRenderer = create(
        // @ts-ignore - because measureElement is untyped
        <BottomDock terria={terria} viewState={viewState} />
      );
    });
    const lastPortal = testRenderer.root.findByProps({
      id: "TJS-BottomDockLastPortal"
    });
    expect(lastPortal).toBeDefined();
  });
});
