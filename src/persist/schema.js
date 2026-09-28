/**
 * 脚本变量结构（zod schema）。
 *
 * 宿主返回的变量是任意 JSON，用 schema 解析后再使用，避免脏数据导致崩溃。
 */

const X = z,
  T = X.z.object({
    scriptId: X.z.string().nullable(),
    elementId: X.z.string().nullable(),
    classSelector: X.z.string().nullable(),
    title: X.z.string().nullable(),
  }),
  D = X.z
    .object({
      savedBalls: X.z
        .array(
          X.z.object({
            fingerprint: T,
            icon: X.z.string(),
            name: X.z.string(),
            originalPosition: X.z
              .object({ top: X.z.string(), left: X.z.string(), right: X.z.string(), bottom: X.z.string() })
              .optional(),
            originalStyle: X.z.string().optional(),
            order: X.z.number().optional(),
          }),
        )
        .default([]),
      releasedFingerprints: X.z.array(T).default([]),
    })
    .prefault({})

export { D as persistSchema }
