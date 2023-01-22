import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, test } from "vitest";
import { RouterLinkStub, shallowMount } from "@vue/test-utils";

import PlayerDetails from "@/components/PlayerDetails.vue";
import usePlayerStore from "@/stores/player";

describe("PlayerDetails", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
  });

  test("renders song title", async () => {
    const store = usePlayerStore();
    await store.newSong({
      title: "example song",
    });

    const wrapper = shallowMount(PlayerDetails, {
      propsData: { store },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const title = wrapper.find(".song-title");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("example song");
  });

  test("renders song artist", async () => {
    const store = usePlayerStore();
    await store.newSong({
      artist: "exampleartist",
    });

    const wrapper = shallowMount(PlayerDetails, {
      propsData: { store },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    const artist = wrapper.find(".song-artist");
    expect(artist.text()).toBe("exampleartist");
  });

  test("shuffle button toggles shuffle mode", () => {
    const wrapper = shallowMount(PlayerDetails);
    const shuffleBtn = wrapper.find(".control-buttons button:first-of-type");

    shuffleBtn.trigger("click");
    expect(wrapper.vm.randomPlay).toBe(true);

    shuffleBtn.trigger("click");
    expect(wrapper.vm.randomPlay).toBe(false);
  });

  test("volume bar changes volume", () => {
    const wrapper = shallowMount(PlayerDetails);

    // Manual volume change
    const volumeBar = wrapper.find('.volume-controls input[type="range"]');
    volumeBar.setValue(50);
    expect(wrapper.vm.volume).toBe(50);

    // Change volume with volume down button
    const volDownBtn = wrapper.find(".volume-controls button:first-of-type");
    volDownBtn.trigger("click");
    expect(wrapper.vm.volume).toBe(45);

    // Change volume with volume up button
    const volUpBtn = wrapper.find(".volume-controls button:last-of-type");
    volUpBtn.trigger("click");
    expect(wrapper.vm.volume).toBe(50);
  });

  test("renders route link", async () => {
    const store = usePlayerStore();
    await store.newSong({
      id: "3WATIKTlfJau0MFW0nmU",
    });

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
