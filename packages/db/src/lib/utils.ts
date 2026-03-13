import { timestamp } from "drizzle-orm/pg-core";

export function timestamps() {
  return {
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  };
}

export type Enum<E> = Record<keyof E, number | string> & Record<number, string>;

export const enumValues = <E extends Record<string, string | number>>(
  e: E,
): [string, ...string[]] => {
  const values = Object.values(e).filter(
    (v): v is string => typeof v === "string",
  );
  if (values.length === 0) {
    throw new Error("Enum must have at least one string value");
  }
  return values as [string, ...string[]];
};
