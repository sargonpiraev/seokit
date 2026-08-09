import { expect as baseExpect, test } from "@playwright/test";
import { extendSeokitExpect } from "@sargonpiraev/seokit";

const expect = extendSeokitExpect(baseExpect);

export { test, expect };
