import { expect as baseExpect, test } from "@playwright/test";
import { extendSeoditExpect } from "@sargonpiraev/seodit";

const expect = extendSeoditExpect(baseExpect);

export { test, expect };
