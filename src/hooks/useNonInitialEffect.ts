import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useNonInitialEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const initialRender = useRef(true);
  useEffect(() => {
    let effectReturns: any;
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effectReturns = effect();
    }
    if (effectReturns && typeof effectReturns === "function") {
      return effectReturns;
    }
  }, deps);
};
