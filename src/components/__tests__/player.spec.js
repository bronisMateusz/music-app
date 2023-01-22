import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, test } from "vitest";
import { RouterLinkStub, shallowMount } from "@vue/test-utils";

import usePlayerStore from "@/stores/player";
import PlayerDetails from "@/components/PlayerDetails.vue";

describe("Router", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("renders route link", async () => {
    const song = {
      id: "r80QgjQ5iXqBl9g8nmHI",
    };
    const store = usePlayerStore();
    await store.newSong(song);

    const wrapper = shallowMount(PlayerDetails, {
      propsData: { store },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "song",
      params: { id: store.currentSong.id },
    });
  });
});
