import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  confirmed,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alphaSpaces", alpha_spaces);
    defineRule("email", email);
    defineRule("passwordMismatch", confirmed);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `Enter an ${ctx.field}`,
          min: `${ctx.field} is to short`,
          max: `${ctx.field} is to long`,
          alpha_spaces: `${ctx.field} may only contain alphabetical characters and spaces`,
          email: `${ctx.field} should be a valid email`,
          passwordMismatch: "Passwords are different",
          tos: "Accept the Terms of Service",
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `${ctx.field} isn't valid`;

        return message;
      },
    });
  },
};
