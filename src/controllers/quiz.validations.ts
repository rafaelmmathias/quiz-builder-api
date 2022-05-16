import { object, string, array, boolean } from "yup";

export const quizSchema = object({
  title: string().required(),
  published: boolean().required(),
  createdAt: string(),
  createdBy: string(),
  permalinkId: string(),
  questions: array()
    .min(1)
    .max(10)
    .of(
      object().shape({
        title: string().required(),
        type: string().oneOf(["single", "multi"]),
        choices: array()
          .min(1)
          .max(5)
          .of(
            object().shape({
              title: string().required(),
              isCorrect: boolean().required(),
            })
          )
          .when("type", (type, schema: any) => {
            const predicateSingle = function (list: any) {
              return list && list.filter((x: any) => x.isCorrect).length === 1;
            };

            const predicateMulti = function (list: any) {
              const truthy = list && list.filter((x: any) => x.isCorrect).length;
              return truthy >= 1 && truthy <= list.length;
            };

            return schema.test(
              "truthyException",
              "choices bad format",
              type === "multi" ? predicateMulti : predicateSingle
            );
          }),
      })
    )
    .required(),
});
