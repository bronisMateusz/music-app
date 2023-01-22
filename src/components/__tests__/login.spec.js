import { setActivePinia, createPinia } from "pinia";
import useUserStore from "@/stores/user";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticates user", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);
    await store.login({
      email: "mateusz.bronis99@gmail.com",
      password: "SubZero278",
    });
    expect(store.userLoggedIn).toBe(true);
  });
});
