import { setActivePinia, createPinia } from "pinia";
import useUserStore from "@/stores/user";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticate user with correct values", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);
    await store.login({
      email: "mateusz.bronis99@gmail.com",
      password: "SubZero278",
    });
    expect(store.userLoggedIn).toBe(true);
  });

  test("authenticate user with incorrect values", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);
    try {
      await store.login({
        email: "mateusz.bronis99@gmail.com",
        password: "SubZero278",
      });
    } catch (error) {
      console.log(error);
    }
    expect(store.userLoggedIn).not.toBe(true);
  });
});
