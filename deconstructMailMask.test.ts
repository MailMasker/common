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
  expect(deconstructMailMask({ email: "jonsibley.14s@gmail.com" })).toEqual({
    alias: "jonsibley.14s",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "14s",
  });
  expect(deconstructMailMask({ email: "jonsibley.14h@gmail.com" })).toEqual({
    alias: "jonsibley.14h",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "14h",
  });
  expect(deconstructMailMask({ email: "jonsibley.14m@gmail.com" })).toEqual({
    alias: "jonsibley.14m",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "14m",
  });
  expect(deconstructMailMask({ email: "jonsibley.14d@gmail.com" })).toEqual({
    alias: "jonsibley.14d",
    mailMaskParts: ["jonsibley"],
    domain: "gmail.com",
    expiryToken: "14d",
  });
});

test("multiple supported top-level expiry tokens are found and only the last one is returned", () => {
  expect(deconstructMailMask({ email: "jonsibley.14d.14h@gmail.com" })).toEqual(
    {
      alias: "jonsibley.14d.14h",
      mailMaskParts: ["jonsibley"],
      domain: "gmail.com",
      expiryToken: "14h",
    }
  );

  expect(
    deconstructMailMask({ email: "jonsibley.netflix.14d.14h@gmail.com" })
  ).toEqual({
    alias: "jonsibley.netflix.14d.14h",
    mailMaskParts: ["jonsibley", "netflix"],
    domain: "gmail.com",
    expiryToken: "14h",
  });
});

test("typos are discarded", () => {
  expect(deconstructMailMask({ email: "jonsibley.14dh@gmail.com" })).toEqual({
    alias: "jonsibley.14dh",
    mailMaskParts: ["jonsibley", "14dh"],
    domain: "gmail.com",
  });
});
