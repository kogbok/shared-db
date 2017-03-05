/// <reference path="../../../../../typings/index.d.ts" />

import * as core from 'sdb_core';

describe("replica", () => {
  describe("replica PNCounter", () => {
    it("create state PNCounter", () => {
      let state = core.common_replica_state_creators[core.ECommonReplicaType.PN_COUNTER]();
      let value =state.value();
      expect(value).toEqual(0);
    });
  });
});