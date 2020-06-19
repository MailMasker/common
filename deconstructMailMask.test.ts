import { deconstructMailMask } from "./deconstructMailMask";

test("basic email is deconstructed correctly", () => {
  expect(deconstructMailMask({ email: "jonsibley@gmail.com" })).toEqual({
    alias: "jonsibley",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
  });
  expect(
    deconstructMailMask({ email: "jonsibley+something@gmail.com" })
  ).toEqual({
    alias: "jonsibley+something",
    mailMaskParts: ["jonsibley+something"],
    domain: "gmail.com",
  });
});

test("each supported top-level construct is found", () => {
  expect(deconstructMailMask({ email: "jonsibley.12h@gmail.com" })).toEqual({
    alias: "jonsibley.12h",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "12h",
  });
  expect(deconstructMailMask({ email: "jonsibley.14d@gmail.com" })).toEqual({
    alias: "jonsibley.14d",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "14d",
  });
  expect(deconstructMailMask({ email: "jonsibley.2w@gmail.com" })).toEqual({
    alias: "jonsibley.2w",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "2w",
  });
  expect(deconstructMailMask({ email: "jonsibley.6m@gmail.com" })).toEqual({
    alias: "jonsibley.6m",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "6m",
  });
  expect(deconstructMailMask({ email: "jonsibley.1y@gmail.com" })).toEqual({
    alias: "jonsibley.1y",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "1y",
  });
});

test("multiple supported top-level expiry tokens are found and only the last one is returned", () => {
  expect(deconstructMailMask({ email: "jonsibley.14d.1w@gmail.com" })).toEqual({
    alias: "jonsibley.14d.1w",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "1w",
  });

  expect(
    deconstructMailMask({ email: "jonsibley.netflix.14d.7d@gmail.com" })
  ).toEqual({
    alias: "jonsibley.netflix.14d.7d",
    mailMaskParts: ["jonsibley", "netflix"],
    domain: "gmail.com",
    expiryToken: "7d",
  });
});

test("typos are discarded", () => {
  expect(deconstructMailMask({ email: "jonsibley.14dh@gmail.com" })).toEqual({
    alias: "jonsibley.14dh",
    mailMaskParts: ["jonsibley", "14dh"],
    domain: "gmail.com",
  });
});
