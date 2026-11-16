import crypto from "node:crypto";
import { expect } from "chai";
import { transporter } from "../config/email.js";
import {
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../controllers/auth.controller.js";

describe("Password Reset Unit & Validation Tests", () => {
  describe("validateForgotPasswordInput", () => {
    it("fails when email is empty or missing", () => {
      const res = validateForgotPasswordInput({});
      expect(res.valid).to.be.false;
      expect(res.errors[0].field).to.equal("email");
      expect(res.errors[0].message).to.equal("Email is required");
    });

    it("fails when email format is invalid", () => {
      const res = validateForgotPasswordInput({ email: "notanemail" });
      expect(res.valid).to.be.false;
      expect(res.errors[0].field).to.equal("email");
      expect(res.errors[0].message).to.include("valid email address");
    });

    it("passes and normalizes email when valid", () => {
      const res = validateForgotPasswordInput({ email: "  User@Example.COM " });
      expect(res.valid).to.be.true;
      expect(res.errors).to.have.lengthOf(0);
      expect(res.data.email).to.equal("user@example.com");
    });
  });

  describe("validateResetPasswordInput", () => {
    it("fails when token is missing", () => {
      const res = validateResetPasswordInput({
        password: "ValidPass1!",
        confirmPassword: "ValidPass1!",
      });
      expect(res.valid).to.be.false;
      expect(res.errors.some((e) => e.field === "token")).to.be.true;
    });

    it("fails when password is weak or missing", () => {
      const res = validateResetPasswordInput({
        token: "sampletoken123",
        password: "weak",
        confirmPassword: "weak",
      });
      expect(res.valid).to.be.false;
      expect(res.errors.some((e) => e.field === "password")).to.be.true;
    });

    it("fails when passwords do not match", () => {
      const res = validateResetPasswordInput({
        token: "sampletoken123",
        password: "ValidPass1!",
        confirmPassword: "DifferentPass1!",
      });
      expect(res.valid).to.be.false;
      expect(res.errors.some((e) => e.field === "confirmPassword")).to.be.true;
      expect(res.errors.find((e) => e.field === "confirmPassword").message).to.include("do not match");
    });

    it("passes when token, password, and confirmPassword are valid and match", () => {
      const res = validateResetPasswordInput({
        token: "sampletoken123",
        password: "ValidPass1!",
        confirmPassword: "ValidPass1!",
      });
      expect(res.valid).to.be.true;
      expect(res.errors).to.have.lengthOf(0);
      expect(res.data.token).to.equal("sampletoken123");
      expect(res.data.password).to.equal("ValidPass1!");
    });
  });

  describe("Cryptographic Token Generation & Hashing", () => {
    it("generates a high-entropy 32-byte hex token and verifies SHA-256 hash", () => {
      const rawToken = crypto.randomBytes(32).toString("hex");
      expect(rawToken).to.be.a("string").with.lengthOf(64);

      const hash1 = crypto.createHash("sha256").update(rawToken).digest("hex");
      const hash2 = crypto.createHash("sha256").update(rawToken).digest("hex");

      expect(hash1).to.equal(hash2);
      expect(hash1).to.be.a("string").with.lengthOf(64);
    });
  });

  describe("Nodemailer Transporter Configuration", () => {
    it("configures transporter using environment credentials", () => {
      expect(transporter).to.exist;
      expect(transporter.options.host).to.equal(process.env.EMAIL_HOST || "smtp.gmail.com");
      expect(transporter.options.port).to.equal(parseInt(process.env.EMAIL_PORT, 10) || 587);
    });
  });
});

