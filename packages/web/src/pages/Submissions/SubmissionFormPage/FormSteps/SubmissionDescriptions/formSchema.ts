import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const getCreateDescriptionSchema = (intl: TFunction) =>
  Yup.object().shape({
    descriptions: Yup.array().of(
      Yup.object({
        type: Yup.string().required(intl("required")),

        // new fields
        title: Yup.string().when("type", (type: "new" | "complement", schema: any) => {
          if (type === "complement") return schema;
          return schema.min(5, intl("min-characters", { min: 5 })).required(intl("required"));
        }),
        severity: Yup.string().when("type", (type: "new" | "complement", schema: any) => {
          if (type === "complement") return schema;
          return schema.required(intl("required"));
        }),
        description: Yup.string()
          .min(20, intl("min-characters", { min: 20 }))
          .when("type", (type: "new" | "complement", schema: any) => {
            if (type === "complement") return schema;
            return schema.required(intl("required"));
          }),
        isTestApplicable: Yup.boolean().when("type", (type: "new" | "complement", schema: any) => {
          if (type === "new") return schema.required(intl("required"));
          return schema;
        }),

        // complement fields
        needsFix: Yup.boolean(),
        needsTest: Yup.boolean(),
        testNotApplicable: Yup.boolean(),
        complementGhIssueNumber: Yup.string().when("type", (type: "new" | "complement", schema: any) => {
          if (type === "new") return schema;
          return schema.required(intl("required"));
        }),
        complementGhIssue: Yup.object().when("type", (type: "new" | "complement", schema: any) => {
          if (type === "new") return schema;
          return schema.required(intl("required"));
        }),
        complementFixFiles: Yup.array()
          .of(
            Yup.object({
              file: Yup.object().required(intl("required")),
              path: Yup.string()
                .required(intl("required"))
                .test("pathEndsWithFileNameError", intl("pathEndsWithFileNameError"), (val, ctx: any) => {
                  const fileName = ctx.from[0].value.file?.name;
                  return val?.endsWith(fileName) ?? false;
                }),
            })
          )
          .test("min", intl("required"), (val, ctx: any) => {
            const type = ctx.from[0].value.type;
            const needsFix = ctx.from[0].value.needsFix;
            if (type === "new") return true;
            if (!needsFix) return true;
            return (val?.length ?? 0) > 0 ?? false;
          }),
        complementTestFiles: Yup.array()
          .of(
            Yup.object({
              file: Yup.object().required(intl("required")),
              path: Yup.string()
                .required(intl("required"))
                .test("pathEndsWithFileNameError", intl("pathEndsWithFileNameError"), (val, ctx: any) => {
                  const fileName = ctx.from[0].value.file?.name;
                  return val?.endsWith(fileName) ?? false;
                }),
            })
          )
          .test("min", intl("required"), (val, ctx: any) => {
            const type = ctx.from[0].value.type;
            const testNotApplicable = ctx.from[0].value.testNotApplicable;
            const needsTest = ctx.from[0].value.needsTest;
            if (type === "new") return true;
            if (testNotApplicable || !needsTest) return true;
            return (val?.length ?? 0) > 0 ?? false;
          }),
      })
    ),
  });
